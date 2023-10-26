export default async function handler(req, res) {
    if (req.method !== 'POST') { return res.status(405).end(); }
    const { link } = req.body;

    try {
        // First, try to find if the link already exists
        const infoResponse = await fetch(`https://api.dub.co/api/projects/Trustjoy/links/info?domain=trustjoy.app&url=${encodeURIComponent(link)}`, {
            headers: {
                'Authorization': 'Bearer ABjZKN0UQNRZtLz6k1wJSSun'
            }
        });

        const infoData = await infoResponse.json();
        // If the link already exists, return the existing URL
        if (infoData && infoData.id) {
            res.json({ url: infoData.domain + '/' + infoData.key });
            return;
        }

        // If the link doesn't exist, generate a new short link
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

        res.json({ url: shortenedData.domain + '/' + shortenedData.key });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Server error' });
    }
}
