export default async function handler(req, res) {
    if (req.method !== 'POST') { return res.status(405).end(); }
    const { link } = req.body;

    try {
        const infoResponse = await fetch(`https://api.dub.co/api/projects/Trustjoy/links/info?domain=trustjoy.app&url=${encodeURIComponent(link)}`, {
            headers: {
                'Authorization': 'Bearer ABjZKN0UQNRZtLz6k1wJSSun'
            }
        });

        // Check the status of the response
        if (!infoResponse.ok) {
            throw new Error(`Error fetching info: ${infoResponse.statusText}`);
        }

        const infoData = await infoResponse.json();

        // If the link already exists
        if (infoData && infoData.id) {
            res.json({ url: infoData.domain + '/' + infoData.key });
            return;
        }

        // If the link doesn't exist, create a new short link
        const shortenedResponse = await fetch('https://api.dub.co/api/projects/Trustjoy/links', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ABjZKN0UQNRZtLz6k1wJSSun',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ domain: 'trustjoy.app', url: link })
        });

        // Check the status of the response
        if (!shortenedResponse.ok) {
            throw new Error(`Error shortening URL: ${shortenedResponse.statusText}`);
        }

        const shortenedData = await shortenedResponse.json();
        if (shortenedData.error) {
            throw new Error(shortenedData.error);
        }

        res.json({ url: shortenedData.domain + '/' + shortenedData.key });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Server error' });
    }
}
