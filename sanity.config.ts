import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemas } from './sanity/schemas';

export default defineConfig({
	projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'placeholder',
	dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
	basePath: '/studio',
	plugins: [structureTool(), visionTool()],
	schema: { types: schemas }
});
