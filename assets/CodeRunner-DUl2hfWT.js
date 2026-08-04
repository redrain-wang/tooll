import{s as y,c as p,a as e,t,u as r,F as v,r as h,w as k,v as w,m as _,e as d,h as s,o as u}from"./index-iT11WvCb.js";const C={class:"tool-container"},B={class:"text-2xl font-bold mb-2"},T={class:"mb-6",style:{color:"var(--text-secondary)"}},S={class:"mb-4 flex gap-2 flex-wrap"},E=["onClick"],H={class:"grid lg:grid-cols-2 gap-6"},z={class:"mb-2 text-sm font-medium",style:{color:"var(--text-secondary)"}},D={class:"rounded-xl border overflow-hidden",style:{"border-color":"var(--border)"}},I=["srcdoc"],L={class:"mt-4 flex gap-3 flex-wrap"},F={__name:"CodeRunner",setup(M){const n=d(`<div class="box">Hello, ToolBox!</div>
<style>
  body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f0f4ff; }
  .box { background: linear-gradient(135deg, #6366f1, #a855f7); color: #fff; padding: 24px 40px; border-radius: 16px; font-size: 24px; box-shadow: 0 10px 30px rgba(99,102,241,.4); }
</style>
<script>
  console.log('ready')
<\/script>`),f=d(null),i=d(""),x=[{k:"hello",label:"Hello"},{k:"clock",label:"Clock / 时钟"},{k:"counter",label:"Counter / 计数器"}],b={hello:`<div class="box">Hello, ToolBox!</div>
<style>
  body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f0f4ff; }
  .box { background: linear-gradient(135deg, #6366f1, #a855f7); color: #fff; padding: 24px 40px; border-radius: 16px; font-size: 24px; box-shadow: 0 10px 30px rgba(99,102,241,.4); }
</style>
<script>
  console.log('ready')
<\/script>`,clock:`<div id="clock" style="font-size:48px;font-family:monospace;text-align:center;padding:80px 0">--:--:--</div>
<script>
  const el = document.getElementById('clock')
  setInterval(() => { el.textContent = new Date().toLocaleTimeString() }, 1000)
<\/script>`,counter:`<button id="btn" style="font-size:24px;padding:12px 28px;border:none;border-radius:10px;background:#22c55e;color:#fff;cursor:pointer;display:block;margin:80px auto">Count: 0</button>
<script>
  let n = 0
  const btn = document.getElementById('btn')
  btn.onclick = () => { btn.textContent = 'Count: ' + (++n) }
<\/script>`};function g(l){n.value=b[l],c()}function c(){i.value=n.value}function m(){var l;navigator.clipboard.writeText(n.value),(l=window.showToast)==null||l.call(window,s("copied"))}return y(()=>{c()}),(l,o)=>(u(),p("div",C,[e("h1",B,t(r(s)("code-runner")),1),e("p",T,t(r(s)("code-runner-desc")),1),e("div",S,[(u(),p(v,null,h(x,a=>e("button",{key:a.k,onClick:V=>g(a.k),class:"btn-secondary"},t(a.label),9,E)),64))]),e("div",H,[e("div",null,[o[1]||(o[1]=e("div",{class:"mb-2 text-sm font-medium",style:{color:"var(--text-secondary)"}},"HTML / CSS / JS",-1)),k(e("textarea",{"onUpdate:modelValue":o[0]||(o[0]=a=>n.value=a),onInput:c,class:"tool-input h-96 font-mono text-sm",placeholder:"<h1>Hello</h1>"},null,544),[[w,n.value]])]),e("div",null,[e("div",z,t(r(s)("preview")),1),e("div",D,[o[2]||(o[2]=_('<div class="flex items-center gap-1 px-3 py-1.5 bg-black/5 dark:bg-white/10"><span class="w-2.5 h-2.5 rounded-full bg-red-500"></span><span class="w-2.5 h-2.5 rounded-full bg-yellow-400"></span><span class="w-2.5 h-2.5 rounded-full bg-green-500"></span><span class="ml-2 text-xs" style="color:var(--text-secondary);">sandbox</span></div>',1)),e("iframe",{ref_key:"frameEl",ref:f,sandbox:"allow-scripts allow-modals allow-forms allow-popups",class:"w-full bg-white",style:{height:"380px"},srcdoc:i.value},null,8,I)])])]),e("div",L,[e("button",{onClick:c,class:"btn-primary"},"▶ "+t(r(s)("run")),1),e("button",{onClick:m,class:"btn-secondary"},"📋 "+t(r(s)("copy")),1)])]))}};export{F as default};
