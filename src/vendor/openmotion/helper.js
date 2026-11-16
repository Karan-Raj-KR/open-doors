// OpenMotion, Copyright (c) 2026 Yuan-Man. MIT. See LICENSE.
                                                                            
import { easingPreset } from "./easing.js";

/** A component before it is persisted — id/projectId/timestamps assigned at creation. */
                                                                                                   

                              
             
               
                                                                     
                      
                 
                                
 

let orderCounter = 0;
export function resetOrder() {
  orderCounter = 0;
}

/** Build a component draft with sensible defaults. */
export function draft(
  name        ,
  opts          
         
                      
                    
                 
                        
                   
                  
                
                   
               
                  
                 
                 
     
    = {},
)                 {
  const draft                 = {
    sceneId: null,
    name,
    selector: null,
    templateId: null,
    durationMs: opts.durationMs ?? 800,
    delayMs: opts.delayMs ?? 0,
    iterationCount: opts.iterationCount ?? 1,
    direction: opts.direction ?? "normal",
    fillMode: opts.fillMode ?? "forwards",
    playState: "running",
    trigger: opts.trigger ?? "onLoad",
    easing: opts.easing ?? easingPreset("ease-out"),
    keyframes: opts.keyframes ?? [],
    style: opts.style ?? {},
    orderIndex: orderCounter++,
    parentId: null,
  };
  return draft;
}

export const kf = (offset        , properties                        , easing         )           => ({
  offset,
  properties,
  easing,
});
