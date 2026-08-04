import{e as c,z as b,B as y,c as x,a as e,t as a,u as l,w as _,v as f,p,q as m,h as o,o as w}from"./index-Bv2n2GQp.js";const g={class:"tool-container"},k={class:"text-2xl font-bold mb-2"},C={class:"mb-6",style:{color:"var(--text-secondary)"}},T={class:"space-y-4"},B={class:"grid md:grid-cols-2 gap-6"},D={class:"space-y-4"},H={class:"flex items-center justify-between"},j={class:"text-sm",style:{color:"var(--text-secondary)"}},z={class:"flex gap-2"},E=["placeholder"],M={class:"space-y-4"},P={class:"flex items-center justify-between"},U={class:"text-sm",style:{color:"var(--text-secondary)"}},S={class:"flex gap-2"},V={class:"rounded-xl border overflow-hidden flex justify-center",style:{background:"var(--bg)","border-color":"var(--border)","min-height":"320px"}},$=["srcdoc"],L={__name:"HtmlPreview",setup(q){const s=c(`<!DOCTYPE html>
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
</html>`),v=c(s.value),t=c("desktop");let i=null;b(s,()=>{clearTimeout(i),i=setTimeout(()=>{v.value=s.value},300)}),y(()=>{clearTimeout(i)});function u(){var n;navigator.clipboard.writeText(s.value),(n=window.showToast)==null||n.call(window,o("copied"))}function h(){s.value=""}return(n,r)=>(w(),x("div",g,[e("h1",k,a(l(o)("html-preview-title")),1),e("p",C,a(l(o)("html-preview-desc")),1),e("div",T,[e("div",B,[e("div",D,[e("div",H,[e("label",j,a(l(o)("html-preview-input")),1),e("div",z,[e("button",{onClick:u,class:"btn-secondary text-xs"},"📋 "+a(l(o)("copy")),1),e("button",{onClick:h,class:"btn-secondary text-xs"},"🗑️ "+a(l(o)("reset")),1)])]),_(e("textarea",{"onUpdate:modelValue":r[0]||(r[0]=d=>s.value=d),class:"tool-input h-80 font-mono text-sm",placeholder:l(o)("html-preview-placeholder"),spellcheck:"false"},null,8,E),[[f,s.value]])]),e("div",M,[e("div",P,[e("label",U,a(l(o)("preview")),1),e("div",S,[e("button",{onClick:r[1]||(r[1]=d=>t.value="desktop"),class:m(["text-xs px-3 py-1 rounded-lg border transition-colors",t.value==="desktop"?"border-primary":""]),style:p({borderColor:t.value==="desktop"?"var(--primary)":"var(--border)",color:t.value==="desktop"?"var(--primary)":"var(--text-secondary)"})},"🖥️ Desktop",6),e("button",{onClick:r[2]||(r[2]=d=>t.value="mobile"),class:m(["text-xs px-3 py-1 rounded-lg border transition-colors",t.value==="mobile"?"border-primary":""]),style:p({borderColor:t.value==="mobile"?"var(--primary)":"var(--border)",color:t.value==="mobile"?"var(--primary)":"var(--text-secondary)"})},"📱 Mobile",6)])]),e("div",V,[e("iframe",{srcdoc:v.value,style:p({width:t.value==="mobile"?"375px":"100%",height:"100%",minHeight:"320px",border:"none",background:"#fff"}),sandbox:"allow-scripts"},null,12,$)])])])])]))}};export{L as default};
