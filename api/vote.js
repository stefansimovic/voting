import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const data = req.body;

      // Pfad zur database.json Datei
      const filePath = path.join(process.cwd(), 'database.json');

      // Alte Daten lesen (oder leeres Array wenn Datei nicht existiert)
      let fileData = [];
      if (fs.existsSync(filePath)) {
        fileData = JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]');
      }

      // Neues Voting zur Datei hinzufügen
      fileData.push(data);

      // Neue Datei speichern
      fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));

      res.status(200).json({ message: 'Vote saved successfully!' });
    } catch (error) {
      console.error('Error saving vote:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
