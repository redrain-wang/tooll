import{c as s,a as e,t as o,u as i,w as f,v as k,F as g,r as y,b as S,e as m,d as v,h as r,o as n,q as _,s as w}from"./index-jFU8zPY3.js";const E={class:"tool-container"},D={class:"text-2xl font-bold mb-2"},W={class:"mb-6",style:{color:"var(--text-secondary)"}},A={class:"grid md:grid-cols-3 gap-4"},B={class:"space-y-2"},R={class:"flex items-center gap-2 mb-3"},F=["placeholder"],I={class:"flex flex-wrap gap-2 mb-3"},G=["onClick"],j={class:"space-y-1 max-h-96 overflow-y-auto"},q=["onClick"],z={class:"font-medium"},M={class:"block text-xs mt-0.5 opacity-70"},V={class:"md:col-span-2 card space-y-4"},Q={key:0,class:"space-y-4"},U={class:"flex items-center justify-between"},$={class:"font-semibold text-lg",style:{color:"var(--text)"}},K={class:"flex gap-2"},H={class:"text-sm",style:{color:"var(--text-secondary)"}},N={key:0},O={class:"text-sm font-medium block mb-2",style:{color:"var(--text-secondary)"}},J={class:"space-y-2"},X={class:"text-sm w-24",style:{color:"var(--text-secondary)"}},Y=["onUpdate:modelValue","placeholder"],Z={class:"text-sm font-medium block mb-2",style:{color:"var(--text-secondary)"}},ee={class:"p-4 rounded-lg text-sm whitespace-pre-wrap font-mono",style:{background:"var(--bg)",color:"var(--text)","min-height":"100px"}},te={key:1,class:"text-center py-16",style:{color:"var(--text-secondary)"}},ae={class:"text-lg"},re={__name:"PromptLibrary",setup(le){const p=m(""),d=m("All"),l=m(null),h=m({}),b=[{title:"Code Review",cat:"Programming",desc:"Review code for bugs, performance, and style issues.",template:`Please review the following code and identify:
1. Bugs or potential errors
2. Performance issues
3. Code style improvements

Code:
{code}`,vars:[{key:"code",label:"Code",placeholder:"Paste your code..."}]},{title:"Bug Fix Helper",cat:"Programming",desc:"Help debug and fix code issues.",template:`I have the following bug in my code:

Error: {error}

Code:
{code}

Please help me understand the cause and provide a fix.`,vars:[{key:"error",label:"Error",placeholder:"Error message"},{key:"code",label:"Code",placeholder:"Relevant code"}]},{title:"API Design",cat:"Programming",desc:"Design RESTful API endpoints.",template:`Design a RESTful API for {project}.

Include:
- Endpoint paths and methods
- Request/response formats
- Authentication approach
- Error handling`,vars:[{key:"project",label:"Project",placeholder:"e.g., user management system"}]},{title:"SQL Query",cat:"Programming",desc:"Generate SQL queries from natural language.",template:`Write a SQL query for the following:

{description}

Table schema:
{schema}`,vars:[{key:"description",label:"Description",placeholder:"What you want to query"},{key:"schema",label:"Schema",placeholder:"Table structure"}]},{title:"Blog Post",cat:"Writing",desc:"Write a blog post on any topic.",template:`Write a blog post about {topic}.

Target audience: {audience}
Tone: {tone}
Length: {length}`,vars:[{key:"topic",label:"Topic",placeholder:"Blog topic"},{key:"audience",label:"Audience",placeholder:"e.g., developers"},{key:"tone",label:"Tone",placeholder:"e.g., professional"},{key:"length",label:"Length",placeholder:"e.g., 1000 words"}]},{title:"Email Draft",cat:"Writing",desc:"Draft professional emails.",template:`Draft a professional email:

To: {to}
Purpose: {purpose}
Tone: {tone}
Key points: {points}`,vars:[{key:"to",label:"To",placeholder:"Recipient"},{key:"purpose",label:"Purpose",placeholder:"Email purpose"},{key:"tone",label:"Tone",placeholder:"e.g., formal"},{key:"points",label:"Key Points",placeholder:"Main points to cover"}]},{title:"Summary",cat:"Writing",desc:"Summarize long text or articles.",template:`Summarize the following text in {length}:

{text}`,vars:[{key:"length",label:"Length",placeholder:"e.g., 3 sentences"},{key:"text",label:"Text",placeholder:"Text to summarize"}]},{title:"Translation",cat:"Language",desc:"Translate text between languages.",template:`Translate the following from {from} to {to}:

{text}`,vars:[{key:"from",label:"From",placeholder:"Source language"},{key:"to",label:"To",placeholder:"Target language"},{key:"text",label:"Text",placeholder:"Text to translate"}]},{title:"Grammar Check",cat:"Language",desc:"Check and fix grammar errors.",template:`Check the grammar and fix any errors in the following text:

{text}`,vars:[{key:"text",label:"Text",placeholder:"Text to check"}]},{title:"Explain Concept",cat:"Learning",desc:"Explain complex concepts simply.",template:`Explain {concept} in simple terms that a {level} can understand.

Use examples if possible.`,vars:[{key:"concept",label:"Concept",placeholder:"What to explain"},{key:"level",label:"Level",placeholder:"e.g., 10 year old, beginner developer"}]},{title:"Flashcards",cat:"Learning",desc:"Generate study flashcards.",template:"Generate flashcards for {topic}.",vars:[{key:"topic",label:"Topic",placeholder:"Study topic"}]},{title:"Product Description",cat:"Marketing",desc:"Write compelling product descriptions.",template:`Write a product description for:

Product: {product}
Features: {features}
Target audience: {audience}
Tone: {tone}`,vars:[{key:"product",label:"Product",placeholder:"Product name"},{key:"features",label:"Features",placeholder:"Key features"},{key:"audience",label:"Audience",placeholder:"Target customers"},{key:"tone",label:"Tone",placeholder:"e.g., professional, casual"}]},{title:"Social Media Post",cat:"Marketing",desc:"Create engaging social media content.",template:`Create a {platform} post about {topic}.

Goal: {goal}
Tone: {tone}
Include hashtags: yes/no`,vars:[{key:"platform",label:"Platform",placeholder:"e.g., Twitter, LinkedIn"},{key:"topic",label:"Topic",placeholder:"Post topic"},{key:"goal",label:"Goal",placeholder:"e.g., engagement, sales"},{key:"tone",label:"Tone",placeholder:"e.g., friendly, professional"}]}],T=v(()=>["All",...new Set(b.map(a=>a.cat))]),P=v(()=>b.filter(a=>{const c=d.value==="All"||a.cat===d.value,t=!p.value||a.title.toLowerCase().includes(p.value.toLowerCase());return c&&t})),x=v(()=>{if(!l.value)return"";let a=l.value.template;for(const[c,t]of Object.entries(h.value))a=a.replace(new RegExp(`\\{${c}\\}`,"g"),t||`[${c}]`);return a});function C(){var a;navigator.clipboard.writeText(x.value),(a=window.showToast)==null||a.call(window,r("copied"))}function L(){var a;l.value&&(navigator.clipboard.writeText(l.value.template),(a=window.showToast)==null||a.call(window,r("copied")))}return(a,c)=>(n(),s("div",E,[e("h1",D,o(i(r)("prompt-title")),1),e("p",W,o(i(r)("prompt-desc")),1),e("div",A,[e("div",B,[e("div",R,[c[1]||(c[1]=e("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[e("circle",{cx:"11",cy:"11",r:"8"}),e("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})],-1)),f(e("input",{"onUpdate:modelValue":c[0]||(c[0]=t=>p.value=t),class:"tool-input text-sm",placeholder:i(r)("search")},null,8,F),[[k,p.value]])]),e("div",I,[(n(!0),s(g,null,y(T.value,t=>(n(),s("button",{key:t,onClick:u=>d.value=t,class:w(["text-xs px-3 py-1 rounded-full transition-colors",d.value===t?"bg-indigo-500 text-white":""]),style:_(d.value!==t?{background:"var(--card-bg)",color:"var(--text)",border:"1px solid var(--border)"}:{})},o(t),15,G))),128))]),e("div",j,[(n(!0),s(g,null,y(P.value,(t,u)=>(n(),s("button",{key:u,onClick:oe=>l.value=t,class:w(["w-full text-left p-3 rounded-lg text-sm transition-colors",l.value===t?"ring-2 ring-indigo-500":""]),style:_({background:l.value===t?"var(--primary)":"var(--card-bg)",color:l.value===t?"white":"var(--text)",border:"1px solid var(--border)"})},[e("span",z,o(t.title),1),e("span",M,o(t.cat),1)],14,q))),128))])]),e("div",V,[l.value?(n(),s("div",Q,[e("div",U,[e("h3",$,o(l.value.title),1),e("div",K,[e("button",{onClick:C,class:"btn-primary text-xs"},"📋 "+o(i(r)("copy")),1),e("button",{onClick:L,class:"btn-secondary text-xs"},"📝 "+o(i(r)("prompt-copy-template")),1)])]),e("p",H,o(l.value.desc),1),l.value.vars&&l.value.vars.length?(n(),s("div",N,[e("label",O,o(i(r)("prompt-vars")),1),e("div",J,[(n(!0),s(g,null,y(l.value.vars,t=>(n(),s("div",{key:t.key,class:"flex items-center gap-2"},[e("label",X,o(t.label),1),f(e("input",{"onUpdate:modelValue":u=>h.value[t.key]=u,class:"tool-input flex-1",placeholder:t.placeholder||""},null,8,Y),[[k,h.value[t.key]]])]))),128))])])):S("",!0),e("div",null,[e("label",Z,o(i(r)("prompt-result")),1),e("div",ee,o(x.value),1)])])):(n(),s("div",te,[e("p",ae,o(i(r)("prompt-select")),1)]))])])]))}};export{re as default};
