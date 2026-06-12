const { spawn } = require('child_process');
const http = require('http');

const PHP_PORT = 8000;
const API_URL = `http://localhost:${PHP_PORT}/backend/api`;

// Start PHP Server
const phpServer = spawn('php', ['-S', `localhost:${PHP_PORT}`], {
    cwd: __dirname,
    stdio: 'ignore'
});

console.log(`Started PHP Server on port ${PHP_PORT}`);

// Helper for HTTP Request
function request(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: PHP_PORT,
            path: `/backend/api/${path}`,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    console.error('Raw Body:', body);
                    reject(e);
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function runTests() {
    // Give PHP time to start
    await new Promise(r => setTimeout(r, 1000));

    try {
        console.log('Test 1: Create Lead');
        const lead = {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            company: 'Test Corp',
            industry: 'Technology',
            budget: '50k+'
        };
        const createRes = await request('POST', 'leads.php', lead);
        console.log('Create Response:', createRes);

        if (createRes.status !== 'success') throw new Error('Failed to create lead');

        console.log('\nTest 2: Fetch Leads');
        const getRes = await request('GET', 'leads.php');
        const leads = getRes.data;
        console.log(`Fetched ${leads.length} leads`);

        const found = leads.some(l => l.email === 'test@example.com');
        if (found) {
            console.log('SUCCESS: Lead found in database!');
        } else {
            console.error('FAILURE: Lead not found.');
        }

    } catch (err) {
        console.error('Test Failed:', err);
    } finally {
        phpServer.kill();
        process.exit();
    }
}

runTests();
