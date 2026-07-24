<?php
// backend/classes/AutomationOrchestrator.php
require_once __DIR__ . '/AIOrchestrator.php';

class AutomationOrchestrator
{
    private $pdo;
    private $aiOrchestrator;
    private $settings;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
        $this->loadSettings();
    }

    private function loadSettings()
    {
        $stmt = $this->pdo->query("SELECT * FROM ai_settings ORDER BY id DESC LIMIT 1");
        $this->settings = $stmt->fetch();

        // Use defaults or throw error if not configured
        if (!$this->settings) {
            // Optional: Set default fallbacks or handle gracefully
        } else {
            $this->aiOrchestrator = new AIOrchestrator(
                $this->settings['provider'],
                $this->settings['api_key'],
                $this->settings['model']
            );
        }
    }

    public function generateRoadmap($leadId)
    {
        if (!$this->settings || !$this->settings['api_key']) {
            throw new Exception("AI Settings not configured");
        }

        // 1. Fetch Lead
        $stmt = $this->pdo->prepare("SELECT * FROM leads WHERE id = ?");
        $stmt->execute([$leadId]);
        $lead = $stmt->fetch();

        if (!$lead)
            throw new Exception("Lead not found");

        // 2. Build Prompt
        $prompt = "Generate a strategic AI Implementation Roadmap for a client with the following details:\n\n";
        $prompt .= "Name: {$lead['first_name']} {$lead['last_name']}\n";
        $prompt .= "Company: {$lead['company']}\n";
        $prompt .= "Industry: {$lead['industry']}\n";
        $prompt .= "Goals/Challenges: {$lead['challenges']}\n";
        $prompt .= "Budget: {$lead['budget']}\n";
        $prompt .= "\nPlease provide a phased approach (Phase 1, 2, 3) with specific AI solutions tailored to their industry.";

        $system = "You are an expert AI Consultant. Create professional, actionable business roadmaps.";

        // 3. Call AI
        $roadmapContent = $this->aiOrchestrator->generateCompletion($prompt, $system);

        // 4. Save to DB
        $update = $this->pdo->prepare("UPDATE leads SET roadmap_status = 'completed', roadmap_content = :content WHERE id = :id");
        $update->execute([':content' => $roadmapContent, ':id' => $leadId]);

        // 5. Trigger Webhook (Email)
        if (!empty($this->settings['roadmap_webhook_url'])) {
            $this->sendToWebhook($this->settings['roadmap_webhook_url'], [
                'email' => $lead['email'],
                'name' => $lead['first_name'],
                'roadmap' => $roadmapContent,
                'lead_id' => $leadId
            ]);
        }

        return $roadmapContent;
    }

    private function sendToWebhook($url, $data)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_exec($ch);
        curl_close($ch);
    }
}
?>