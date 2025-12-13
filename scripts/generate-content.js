import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../content');
const OUTPUT_FILE = path.join(__dirname, '../src/data/content.json');

const difficulties = ['easy', 'medium', 'hard'];

const generateContent = () => {
    const content = {};

    difficulties.forEach(difficulty => {
        const problemsDir = path.join(CONTENT_DIR, difficulty, 'problems');
        const programsDir = path.join(CONTENT_DIR, difficulty, 'programs');

        if (!fs.existsSync(problemsDir) || !fs.existsSync(programsDir)) {
            console.warn(`Skipping ${difficulty}: directories not found`);
            content[difficulty] = [];
            return;
        }

        const problemFiles = fs.readdirSync(problemsDir).filter(f => f.endsWith('.md'));

        const items = problemFiles.map(file => {
            const id = path.basename(file, '.md');
            const programFile = `${id}.py`;
            const programPath = path.join(programsDir, programFile);

            let code = '';
            if (fs.existsSync(programPath)) {
                code = fs.readFileSync(programPath, 'utf-8');
            } else {
                console.warn(`Warning: No program found for ${id} in ${difficulty}`);
            }

            const description = fs.readFileSync(path.join(problemsDir, file), 'utf-8');

            // Extract title from first line of description if possible, or use ID
            const titleMatch = description.match(/^#\s+(.+)$/m);
            const title = titleMatch ? titleMatch[1] : id;

            return {
                id,
                title,
                description,
                code,
                difficulty
            };
        });

        // Sort by ID (A1, A2, ... A10)
        items.sort((a, b) => {
            const numA = parseInt(a.id.replace(/\D/g, ''));
            const numB = parseInt(b.id.replace(/\D/g, ''));
            return numA - numB;
        });

        content[difficulty] = items;
    });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(content, null, 2));
    console.log(`Content generated at ${OUTPUT_FILE}`);
};

generateContent();
