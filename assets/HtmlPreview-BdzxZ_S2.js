import{e as c,A as b,C as y,c as x,a as e,t as a,u as l,w as _,v as f,q as v,s as m,h as o,o as w}from"./index-_U56gwTr.js";const g={class:"tool-container"},k={class:"text-2xl font-bold mb-2"},C={class:"mb-6",style:{color:"var(--text-secondary)"}},T={class:"space-y-4"},D={class:"grid md:grid-cols-2 gap-6"},H={class:"space-y-4"},j={class:"flex items-center justify-between"},B={class:"text-sm",style:{color:"var(--text-secondary)"}},E={class:"flex gap-2"},M=["placeholder"],P={class:"space-y-4"},U={class:"flex items-center justify-between"},z={class:"text-sm",style:{color:"var(--text-secondary)"}},S={class:"flex gap-2"},V={class:"rounded-xl border overflow-hidden flex justify-center",style:{background:"var(--bg)","border-color":"var(--border)","min-height":"320px"}},$=["srcdoc"],F={__name:"HtmlPreview",setup(q){const s=c(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 2rem; margin: 0; }
    h1 { color: #333; }
    .card { background: #f5f5f5; padding: 1rem; border-radius: 8px; margin-top: 1rem; }
  </style>
</head>
<body>
  <h1>Hello World!</h1>
  <div class="card">
    <p>Edit the HTML on the left to see changes here.</p>
  </div>
</body>
</html>`),p=c(s.value),t=c("desktop");let i=null;b(s,()=>{clearTimeout(i),i=setTimeout(()=>{p.value=s.value},300)}),y(()=>{clearTimeout(i)});function u(){var n;navigator.clipboard.writeText(s.value),(n=window.showToast)==null||n.call(window,o("copied"))}function h(){s.value=""}return(n,r)=>(w(),x("div",g,[e("h1",k,a(l(o)("html-preview-title")),1),e("p",C,a(l(o)("html-preview-desc")),1),e("div",T,[e("div",D,[e("div",H,[e("div",j,[e("label",B,a(l(o)("html-preview-input")),1),e("div",E,[e("button",{onClick:u,class:"btn-secondary text-xs"},"📋 "+a(l(o)("copy")),1),e("button",{onClick:h,class:"btn-secondary text-xs"},"🗑️ "+a(l(o)("reset")),1)])]),_(e("textarea",{"onUpdate:modelValue":r[0]||(r[0]=d=>s.value=d),class:"tool-input h-80 font-mono text-sm",placeholder:l(o)("html-preview-placeholder"),spellcheck:"false"},null,8,M),[[f,s.value]])]),e("div",P,[e("div",U,[e("label",z,a(l(o)("preview")),1),e("div",S,[e("button",{onClick:r[1]||(r[1]=d=>t.value="desktop"),class:m(["text-xs px-3 py-1 rounded-lg border transition-colors",t.value==="desktop"?"border-primary":""]),style:v({borderColor:t.value==="desktop"?"var(--primary)":"var(--border)",color:t.value==="desktop"?"var(--primary)":"var(--text-secondary)"})},"🖥️ Desktop",6),e("button",{onClick:r[2]||(r[2]=d=>t.value="mobile"),class:m(["text-xs px-3 py-1 rounded-lg border transition-colors",t.value==="mobile"?"border-primary":""]),style:v({borderColor:t.value==="mobile"?"var(--primary)":"var(--border)",color:t.value==="mobile"?"var(--primary)":"var(--text-secondary)"})},"📱 Mobile",6)])]),e("div",V,[e("iframe",{srcdoc:p.value,style:v({width:t.value==="mobile"?"375px":"100%",height:"100%",minHeight:"320px",border:"none",background:"#fff"}),sandbox:"allow-scripts"},null,12,$)])])])])]))}};export{F as default};
