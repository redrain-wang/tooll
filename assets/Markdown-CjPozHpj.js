import{c as u,a as t,t as d,u as r,w as x,v as f,e as g,h as l,d as b,o as w}from"./index-_U56gwTr.js";const y={class:"tool-container"},v={class:"text-2xl font-bold mb-2"},k={class:"mb-6",style:{color:"var(--text-secondary)"}},_={class:"grid md:grid-cols-2 gap-4",style:{"min-height":"500px"}},$={class:"text-sm font-medium mb-2",style:{color:"var(--text-secondary)"}},T={class:"flex items-center justify-between mb-2"},M={class:"text-sm font-medium",style:{color:"var(--text-secondary)"}},H=["innerHTML"],E={__name:"Markdown",setup(L){const a=g(`# Hello Markdown

This is a **preview** tool.`),p=b(()=>{let e=a.value;return e=e.replace(/^### (.+)$/gm,"<h3>$1</h3>").replace(/^## (.+)$/gm,"<h2>$1</h2>").replace(/^# (.+)$/gm,"<h1>$1</h1>"),e=e.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>"),e=e.replace(/```(\w+)?\n([\s\S]*?)```/g,"<pre><code>$2</code></pre>").replace(/`([^`]+)`/g,"<code>$1</code>"),e=e.replace(/^> (.+)$/gm,"<blockquote>$1</blockquote>").replace(/^- (.+)$/gm,"<li>$1</li>"),e=e.replace(/\n\n/g,"<br><br>"),'<div style="line-height:1.7">'+e+"</div>"});function m(){var n;const e=document.getElementById("markdown-preview");if(!e)return;const o=window.open("","_blank");o.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Markdown Export</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; line-height: 1.7; color: #333; max-width: 800px; margin: 0 auto; }
        h1, h2, h3 { margin-top: 1.5em; }
        pre { background: #f5f5f5; padding: 12px; border-radius: 6px; overflow-x: auto; }
        code { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 16px; color: #666; }
        @media print { body { padding: 0; } }
      </style>
    </head>
    <body>${e.innerHTML}</body>
    </html>
  `),o.document.close(),setTimeout(()=>{o.print()},300),(n=window.showToast)==null||n.call(window,l("copied"))}function h(){var c;const e=document.getElementById("markdown-preview");if(!e)return;const o=`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Markdown Export</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; line-height: 1.7; color: #333; max-width: 800px; margin: 0 auto; }
    h1, h2, h3 { margin-top: 1.5em; }
    pre { background: #f5f5f5; padding: 12px; border-radius: 6px; overflow-x: auto; }
    code { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 16px; color: #666; }
  </style>
</head>
<body>${e.innerHTML}</body>
</html>`,n=new Blob([o],{type:"text/html"}),i=URL.createObjectURL(n),s=document.createElement("a");s.href=i,s.download="markdown-export.html",s.click(),URL.revokeObjectURL(i),(c=window.showToast)==null||c.call(window,l("copied"))}return(e,o)=>(w(),u("div",y,[t("h1",v,d(r(l)("markdown")),1),t("p",k,d(r(l)("markdown-desc")),1),t("div",_,[t("div",null,[t("p",$,d(r(l)("edit")),1),x(t("textarea",{"onUpdate:modelValue":o[0]||(o[0]=n=>a.value=n),class:"tool-input h-full font-mono text-sm",style:{"min-height":"460px"},placeholder:"# Hello"},null,512),[[f,a.value]])]),t("div",null,[t("div",T,[t("p",M,d(r(l)("preview")),1),t("div",{class:"flex gap-2"},[t("button",{onClick:h,class:"btn-secondary text-xs"},"📄 HTML"),t("button",{onClick:m,class:"btn-primary text-xs"},"📑 PDF")])]),t("div",{id:"markdown-preview",class:"card h-full overflow-auto",style:{"min-height":"460px"},innerHTML:p.value},null,8,H)])])]))}};export{E as default};
