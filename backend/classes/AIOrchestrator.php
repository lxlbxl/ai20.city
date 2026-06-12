<?php
// backend/classes/AIOrchestrator.php

class AIOrchestrator
{
    private $provider;
    private $apiKey;
    private $model;

    public function __construct($provider, $apiKey, $model)
    {
        $this->provider = strtolower($provider);
        $this->apiKey = $apiKey;
        $this->model = $model;
    }

    public function generateCompletion($prompt, $systemMessage = "You are a helpful AI assistant.")
    {
        if ($this->provider === 'openrouter') {
            return $this->callOpenRouter($prompt, $systemMessage);
        } else if ($this->provider === 'openai') {
            return $this->callOpenAI($prompt, $systemMessage);
        }
        throw new Exception("Unsupported provider: " . $this->provider);
    }

    private function callOpenRouter($prompt, $systemMessage)
    {
        $url = "https://openrouter.ai/api/v1/chat/completions";
        $data = [
            "model" => $this->model,
            "messages" => [
                ["role" => "system", "content" => $systemMessage],
                ["role" => "user", "content" => $prompt]
            ]
        ];

        return $this->makeRequest($url, $data, [
            "Authorization: Bearer " . $this->apiKey,
            "HTTP-Referer: https://ai20.city", // Required by OpenRouter
            "X-Title: ai20.city"
        ]);
    }

    private function callOpenAI($prompt, $systemMessage)
    {
        $url = "https://api.openai.com/v1/chat/completions";
        $data = [
            "model" => $this->model,
            "messages" => [
                ["role" => "system", "content" => $systemMessage],
                ["role" => "user", "content" => $prompt]
            ]
        ];

        return $this->makeRequest($url, $data, [
            "Authorization: Bearer " . $this->apiKey
        ]);
    }

    private function makeRequest($url, $data, $headers)
    {
        $headers[] = "Content-Type: application/json";

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        // Debug
        // curl_setopt($ch, CURLOPT_VERBOSE, true);

        $response = curl_exec($ch);

        if (curl_errno($ch)) {
            throw new Exception("Curl Error: " . curl_error($ch));
        }

        curl_close($ch);

        $result = json_decode($response, true);

        if (isset($result['error'])) {
            throw new Exception("AI API Error: " . ($result['error']['message'] ?? json_encode($result['error'])));
        }

        return $result['choices'][0]['message']['content'] ?? '';
    }
}
?>