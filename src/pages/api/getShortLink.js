export default async function handler(req, res) {
    if (req.method !== 'POST') { return res.status(405).end(); }
    const { link } = req.body;

    try {
        const shortenedResponse = await fetch('https://api.dub.co/api/projects/Trustjoy/links', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ABjZKN0UQNRZtLz6k1wJSSun',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ domain: 'trustjoy.app', url: link })
        });

        const shortenedData = await shortenedResponse.json();
        if (shortenedData.error) {
            throw new Error(shortenedData.error);
        }
        
        // Extract only the key from the URL provided by the API
        const key = shortenedData.url.split('/').pop();
        
        // Construct the URL using trustjoy.app and the extracted key
        res.json({ url: 'trustjoy.app/' + key });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Server error' });
    }
}
