/** Static lesson building blocks. No server is required. */
export const text = (title,body) => ({type:'text',title,body});
export const code = (title,source,caption='',lang='bash') => ({type:'code',title,source,caption,lang});
export const note = (title,body,level='info') => ({type:'note',title,body,level});
export const table = (title,headers,rows) => ({type:'table',title,headers,rows});
export const list = (title,items) => ({type:'list',title,items});
export const diagram = (title,nodes,footer='') => ({type:'diagram',title,nodes,footer});
export const lab = (kind,title,description) => ({type:'lab',kind,title,description});
export const page = (id,title,goal,lead,blocks=[],minutes=6) => ({id,title,goal,lead,blocks,minutes});
export const question = (prompt,choices,answer,reason) => ({prompt,choices,answer,reason});
