/** Vendor the MIT OpenMotion CSS generator and selected templates from the local clone. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import {execFileSync} from 'node:child_process';
const upstream='open-motion/open-motion/src';
const destination='src/vendor/openmotion';
mkdirSync(destination,{recursive:true});
const files={
 'generator.js':'motion/generator/css.ts', 'units.js':'motion/units.ts',
 'transform.js':'shared/motion/transform.ts', 'easing.js':'shared/motion/easing.ts',
 'helper.js':'motion/templates/helper.ts',
 ...Object.fromEntries(['scrollReveal','bentoGridReveal','depthCard','kineticText','microInteraction'].map(n=>[n+'.js','motion/templates/'+n+'.ts']))
};
for(const [name,path] of Object.entries(files)){
 let source=readFileSync(upstream+'/'+path,'utf8');
 // Runtime validation is unnecessary for these trusted, authored animation recipes.
 if(name==='easing.js')source=source.replace('import { z } from "zod";','').replace(/export const EasingPresetSchema[\s\S]*?(?=export const easingPreset)/,'');
 if(name==='transform.js')source=source.replace('import { z } from "zod";','').replace(/export const TransformPropertySchema[\s\S]*?(?=export const isTransformProperty)/,'').replace(/export const KeyValueSchema[\s\S]*/,'');
 source=stripTypeScriptTypes(source,{mode:'strip'});
 source=source.replaceAll('from "@openmotion/shared"',name==='units.js'?'from "./transform.js"':'from "./easing.js"').replace('from "../units.js"','from "./units.js"');
 writeFileSync(destination+'/'+name,'// OpenMotion, Copyright (c) 2026 Yuan-Man. MIT. See LICENSE.\n'+source);
}
writeFileSync(destination+'/LICENSE',readFileSync('open-motion/LICENSE'));
const revision=execFileSync('git',['-C','open-motion','rev-parse','HEAD'],{encoding:'utf8'}).trim();
writeFileSync(destination+'/SOURCE.md',`# OpenMotion source\n\nSource: https://github.com/Yuan-ManX/open-motion\nRevision: ${revision}\n\nVendored CSS generator, unit handling, easing functions, template helper and five templates. TypeScript types and unused Zod schema exports removed; local import paths rewritten. Runtime animation logic preserved. Refresh with node scripts/sync-openmotion.mjs while the local clone is present.\n`);
console.log('Vendored OpenMotion generator and five templates at '+revision);
