// Decimal GB throughout. Budgets are planning bands, not live offers.
export const devices = [
 ["entry","ПК с 16 ГБ VRAM","PC with 16 GB VRAM",16,500,1500,"cuda","Карты на 8 ГБ сюда не входят.","8 GB GPUs are not covered by this row."],
 ["3090","ПК с RTX 3090 (б/у)","Used RTX 3090 PC",24,1200,2500,"cuda","Проверить охлаждение, блок питания и состояние карты.","Check cooling, power supply and card condition."],
 ["5090","ПК с RTX 5090","RTX 5090 PC",32,3500,6000,"cuda","Быстрая VRAM, но предел памяти — 32 ГБ.","Fast VRAM, but limited to 32 GB."],
 ["amd395","Ryzen AI Max+ 395","Ryzen AI Max+ 395",128,3400,4400,"amd","Общая память; проверить лимит GPU и поддержку движка.","Unified memory: check GPU allocation and engine support."],
 ["amd495","Ryzen AI Max+ PRO 495","Ryzen AI Max+ PRO 495",192,5300,7500,"amd","Нужна именно комплектация на 192 ГБ, не только этот процессор.","Verify the unit actually has 192 GB, not just this processor."],
 ["spark","DGX Spark / GB10 (128 ГБ)","DGX Spark / GB10 (128 GB)",128,4000,7000,"arm","Проверьте поддержку ARM64; есть и более младшая версия на 64 ГБ.","Verify ARM64 support; a smaller 64 GB variant also exists."],
 ["mac96","Mac Studio M5 Ultra (96 ГБ)","Mac Studio M5 Ultra (96 GB)",96,5499,null,"metal","Проверить модель и инструменты на Metal/MLX; CUDA нет.","Check model and tooling on Metal/MLX; no CUDA."],
 ["mac256","Mac Studio M5 Ultra (256 ГБ)","Mac Studio M5 Ultra (256 GB)",256,9499,9499,"metal","$9 499 — M5 Ultra 30 CPU / 64 GPU, SSD 1 ТБ, цена в США до налога.","$9,499 for M5 Ultra 30 CPU / 64 GPU, 1 TB SSD, US before tax."],
 ["mac512","Mac Studio M5 Ultra (512 ГБ)","Mac Studio M5 Ultra (512 GB)",512,22299,null,"metal","Ёмкость для больших весов, не гарантия высокой скорости.","Capacity for large weights does not guarantee speed."],
 ["pro6000","Станция с RTX PRO 6000","RTX PRO 6000 workstation",96,15000,25000,"cuda","96 ГБ отдельной VRAM. Планировать питание, охлаждение и цену всей станции.","96 GB of dedicated VRAM. Budget for power, cooling and the full system."],
];

export const mac256PriceSource = "https://www.bhphotovideo.com/c/product/1997816-REG/apple_ms_m5u_05_mac_studio_m5_ultra.html";
export const flashBenchmarks = {
 entry:["Пример ПК с 16 ГБ VRAM: RTX 5060 Ti, Core i7‑14700 и 128 ГБ ОЗУ. Flash‑Next IQ3_S в Strata 0.2.7: 62,7 ток/с после входа 16K, 8,97 с до первого токена. Медиана трёх прогонов с рассуждением. Модель не размещалась целиком в VRAM.",
        "Example 16 GB PC: RTX 5060 Ti, Core i7‑14700 and 128 GB system RAM. Flash‑Next IQ3_S in Strata 0.2.7: 62.7 tok/s after a 16K prompt, 8.97 s to first token. Median of three runs with thinking on. The full model did not reside in VRAM.",
        "https://github.com/Niko1221/Strata/pull/4401"],
 "3090":["Одна RTX 3090 + 64 ГБ ОЗУ: 43–51 ток/с после входа 131K; vLLM, AutoRound INT4, часть экспертов на CPU.",
         "One RTX 3090 + 64 GB RAM: 43–51 tok/s after 131K; vLLM, AutoRound INT4, some experts run on CPU.",
         "https://github.com/DominikBucko/qwen38-flash-next-3090/blob/main/docs/faq.md"],
 "5090":["RTX 5090 + 64 ГБ RAM: 175,7 ток/с после входа 32K; Strata IQ2_XS + MTP, синтетический тест кода, ответ 256 токенов.",
         "RTX 5090 + 64 GB RAM: 175.7 tok/s after 32K; Strata IQ2_XS + MTP, synthetic code task, 256 output tokens.",
         "https://github.com/MarcoPorcellato/Strata---Qwen3.8-Flash-Next/tree/main/bench/results/2026-09-30-community-rtx-5090"],
 amd395:["Strix Halo, 128 ГБ: 28,2 ток/с после входа 32K без MTP; Gufo, UD-Q4_K_XL.",
         "Strix Halo, 128 GB: 28.2 tok/s after 32K without MTP; Gufo, UD-Q4_K_XL.",
         "https://github.com/gufo-org/gufo/blob/main/docs/internal/models/qwen3.8-flash-next/BENCHMARKS.md"],
 amd495:["Minisforum MS‑S1 MAX, 192 ГБ. Flash‑Next в halogen‑flash‑server 0.20.3: 66,1 ток/с в прозе, 89,5 в коде; четыре потока — 104 ток/с суммарно (26 в среднем на поток). В повторном замере 21 ноября на версии 0.20.7 — 69,4 / 89,9 ток/с и 115 ток/с суммарно.",
         "Minisforum MS‑S1 MAX, 192 GB. Flash‑Next on halogen‑flash‑server 0.20.3: 66.1 tok/s for prose, 89.5 for code; four streams reached 104 tok/s combined (26 each on average). A 21 November rerun on 0.20.7 reached 69.4 / 89.9 tok/s and 115 tok/s combined.",
         "https://petronellatech.com/ai/llm-benchmarks/hardware/ryzen-ai-max-pro-495/"],
 spark:["Один Spark: 70 ток/с; два: 109,5 ток/с. NInfer + MTP3, один запрос с коротким входом (130 токенов). На одном Spark PLE размещалась на SSD.",
        "One Spark: 70 tok/s; two: 109.5 tok/s. NInfer + MTP3, one request with a 130-token prompt. One Spark used disk-backed PLE.",
        "https://github.com/Neroued/ninfer/blob/master/docs/performance/qwen3.8-flash-next.md"],
 mac96:["Mac Studio M5 Ultra, 96 ГБ. Flash‑Next Swift 1.5, MLX 4,7 бит/параметр, mlx‑serve 26.10.1 + MTP. После входа 4K: 111 ток/с в прозе, 153 в коде. После 177K: 88 и 116 ток/с, до первого токена — 69,1 с. В серии тестов использовался swap.",
        "Mac Studio M5 Ultra, 96 GB. Flash‑Next Swift 1.5, MLX 4.7 bits/weight, mlx‑serve 26.10.1 + MTP. At 4K: 111 tok/s for prose, 153 for code. At 177K: 88 and 116 tok/s, with 69.1 s to first token. The test sweep used swap.",
        "https://www.reddit.com/r/LocalLLaMA/comments/1wyqgl6/swift15_qwen38_flash_next_tailored_for_the_96gb/"],
 mac256:["Mac Studio M5 Ultra 256 ГБ: 115,7–131,7 ток/с после входа 32K (проза / код); MLX 6-bit + MTP, TensorFold. Окно 262K отдельно прошло проверку памяти.",
         "Mac Studio M5 Ultra 256 GB: 115.7–131.7 tok/s after 32K (prose/code); MLX 6-bit + MTP, TensorFold. The 262K window passed a separate memory test.",
         "https://niklaslenz.com/v2/qwen38-flash-next-mac-mlx6bit-mtp-tensorfold-128-official-ash/"],
 mac512:["Mac Studio M5 Ultra, 512 ГБ. Flash‑Next 6‑bit в TensorFold 1.2.8 + MTP: 107,7 ток/с после входа 128K и 85,4 ток/с после 1M. До первого токена — 36,5 и 410,4 с соответственно. Один запрос, ответы по 512 токенов, рассуждение отключено.",
         "Mac Studio M5 Ultra, 512 GB. Flash‑Next 6-bit in TensorFold 1.2.8 + MTP: 107.7 tok/s after 128K and 85.4 after 1M. Time to first token: 36.5 and 410.4 s, respectively. One request at a time, 512 output tokens and thinking off.",
         "https://www.reddit.com/r/oMLX/comments/1y05848/i_benchmarked_m5_ultra_512gb_on_10_popular_open/"],
};
const flashPro6000 = [
 "RTX PRO 6000 Blackwell, 96 ГБ VRAM. Qwen3.8 Flash‑Next NVFP4, vLLM 0.30.0. Контекст настроен на 262 144 токена; таблица PLE занимает около 95 ГиБ ОЗУ. Проверены генерация ответа и вызов инструмента.",
 "RTX PRO 6000 Blackwell, 96 GB VRAM. Qwen3.8 Flash‑Next NVFP4, vLLM 0.30.0. The server is configured for 262,144 tokens; the PLE table uses about 95 GiB of host RAM. Answer generation and tool calling passed.",
 "#hw-lab",
];
export function flashRun(id) {
 return id==="pro6000"?flashPro6000:flashBenchmarks[id];
}
export function priceLabel(device, en) {
 const [,,,,low,high]=device;
 const usd=new Intl.NumberFormat(en?"en-US":"ru-RU",{style:"currency",currency:"USD",maximumFractionDigits:0});
 return high===low?usd.format(low):high?`${usd.format(low)}–${usd.format(high)}`:(en?"from ":"от ")+usd.format(low);
}

// 16-bit attention KV: 2 (K/V) × layers × KV heads × head dimension × 2 bytes.
// Model weights are representative text-only quant formats, reserve is an allowance.
export const profiles = {
 llama8:{name:"Llama 3.1 8B · Q4",max:131072,weights:5,kv:131.072,reserve:3,source:"https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct"},
 oss20:{name:"gpt-oss-20b · MXFP4",max:131072,weights:13.76,kv:24.576,reserve:3,source:"https://huggingface.co/openai/gpt-oss-20b"},
 qwen27:{name:"Qwen3.8-27B · Q4_K_M",max:262144,weights:17,kv:65.536,reserve:6,source:"https://huggingface.co/Qwen/Qwen3.8-27B/blob/main/config.json"},
 qwen35:{name:"Qwen3.5-35B-A3B · Q4_K_M",max:262144,weights:22.29,kv:20.48,reserve:6,source:"https://huggingface.co/Qwen/Qwen3.5-35B-A3B/blob/main/config.json",weightsSource:"https://huggingface.co/bartowski/Qwen_Qwen3.5-35B-A3B-GGUF"},
 llama70:{name:"Llama 3.1 70B · Q4",max:131072,weights:43,kv:327.68,reserve:8,source:"https://huggingface.co/meta-llama/Llama-3.1-70B-Instruct"},
 oss120:{name:"gpt-oss-120b · MXFP4",max:131072,weights:65.25,kv:36.864,reserve:8,source:"https://huggingface.co/openai/gpt-oss-120b"},
 flashNext:{name:"Qwen3.8 Flash-Next · NVFP4",max:262144,weights:183,kv:null,reserve:12,layout:"split",source:"https://huggingface.co/Inferact/Qwen3.8-Flash-Next-NVFP4"},
 deepseek:{name:"DeepSeek V4.1 Flash 1017 · EXL3 2.9",max:1048576,weights:211,kv:null,reserve:12,source:"https://huggingface.co/Mia-AiLab/DeepSeek-V4.1-Flash-1017-EXL3-EAQ-v1-2.9-bpw"},
};
export function contextOptions(max) {
 return [...[4096,8192,16384,32768,65536,131072,262144,524288].filter(v=>v<max),max];
}

export function estimate({weights, context, sessions, kv, reserve}) {
 return {cache:context * sessions * kv / 1e6, total:weights+context*sessions*kv/1e6+reserve};
}
export function classify(device, required, budget, backend) {
 const [, , , capacity, low, high, stack] = device;
 return {
   memory: required > capacity ? "no" : required > capacity * .9 ? "tight" : "yes",
   price: low == null ? "unknown" : budget < low ? "no" : high == null || budget < high ? "some" : "yes",
   stack: backend === "any" || backend === stack,
 };
}

const form = globalThis.document?.querySelector("#hw-form");
if (form) {
 const en=document.documentElement.lang==="en";
 const t=(ru,eng)=>en?eng:ru;
 const fmt=new Intl.NumberFormat(en?"en-US":"ru-RU",{maximumFractionDigits:1});
 const by=id=>document.getElementById(id);
 const input=name=>form.elements.namedItem(name);
 const labels={
  memory:{yes:t("Помещается по расчёту","Fits estimate"),tight:t("Мало запаса","Tight fit"),no:t("Не помещается","Does not fit")},
  price:{yes:t("В бюджете","Within budget"),some:t("Зависит от цены","Price dependent"),no:t("Выше бюджета","Over budget"),unknown:t("Нужна цена","Quote needed")},
 };
 const stacks={cuda:"CUDA · x86",amd:"ROCm / Vulkan",arm:"CUDA · ARM64",metal:"Metal / MLX"};
 const mk=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
 function draw(){
  if(!form.checkValidity()) {by("hw-total").textContent=t("Проверьте введённые значения.","Check the values entered.");by("hw-breakdown").textContent="";by("hw-owned").textContent="";by("hw-results").replaceChildren();return;}
  const num=name=>input(name).valueAsNumber;
  const profile=profiles[input("preset").value];
  const advanced=by("hw-engineer").open && profile.layout!=="split";
  const selectedKv=advanced&&input("kv").value!==""?num("kv"):profile.kv;
  const options={weights:advanced?num("weights"):profile.weights,context:Number(input("context").value),
    sessions:advanced?num("sessions"):1,kv:selectedKv??0,reserve:advanced?num("reserve"):profile.reserve};
  const need=estimate(options);
  const unknown=selectedKv==null;
  const split=profile.layout==="split";
  by("hw-total").textContent=unknown?t(
    `От ${fmt.format(need.total)} ГБ без кеша контекста`,`At least ${fmt.format(need.total)} GB before context cache`
  ):t(`Нужно около ${fmt.format(need.total)} ГБ`,`About ${fmt.format(need.total)} GB required`);
  by("hw-breakdown").textContent=t(
    `Веса ${fmt.format(options.weights)} ГБ + кеш ${fmt.format(need.cache)} ГБ + резерв ${fmt.format(options.reserve)} ГБ.`,
    `Weights ${fmt.format(options.weights)} GB + cache ${fmt.format(need.cache)} GB + reserve ${fmt.format(options.reserve)} GB.`);
  if(unknown&&!split)by("hw-breakdown").textContent=t("Кеш DeepSeek зависит от движка. В лаборатории эта сборка работала на двух GB10; полный контекст не проверялся.","DeepSeek cache depends on the engine. The lab ran this build on two GB10s; full context was not tested.");
  if(split){
   by("hw-total").textContent=t("Flash‑Next запускается на разных сборках","Flash‑Next runs on several hardware setups");
   by("hw-breakdown").textContent=t(
    "Откройте «Запуск возможен», чтобы увидеть формат весов, длину запроса и скорость конкретного теста. Замеры не пересчитываются при смене контекста. У NVFP4 на RTX PRO 6000 часть данных хранится в ОЗУ: 183 ГБ на диске — не требование к VRAM.",
    "Open ‘Can run’ for the weight format, prompt length and speed of the reported test. Changing the context setting does not change these measurements. With NVFP4 on RTX PRO 6000, some data is stored in system RAM: roughly 183 GB on disk is not the VRAM requirement.");
  }
  const owned=advanced?num("owned")-need.total:NaN;
  by("hw-owned").textContent=!Number.isFinite(owned)?"":unknown&&owned>=0?t("Для вашего ПК нужна проверка кеша.","Check cache allocation for your PC."):owned>=0?t(
    `Ваш ПК: расчётный запас ${fmt.format(owned)} ГБ. Проверьте поддержку формата весов движком.`,
    `Your PC: ${fmt.format(owned)} GB of estimated headroom. Verify the engine supports the weight format.`
  ):t(`Вашему ПК не хватает около ${fmt.format(-owned)} ГБ.`,`Your PC is about ${fmt.format(-owned)} GB short.`);
  if(split)by("hw-owned").textContent=t("Не складывайте VRAM и ОЗУ: для другой сборки проверяйте оба объёма и поддержку выгрузки в движке.","Don't add VRAM to RAM: verify both pools and offload support for another setup.");
  const sorted=devices.map(d=>[d,classify(d,need.total,num("budget"),advanced?input("backend").value:"any")]);
  const rank=({memory,price,stack})=>(split?0:(!stack?16:0)+({yes:0,tight:4,no:8}[memory]))+
    ({yes:0,some:1,unknown:2,no:3}[price]);
  sorted.sort((a,b)=>rank(a[1])-rank(b[1]) || (a[0][4]??Infinity)-(b[0][4]??Infinity));
  by("hw-results").replaceChildren(...sorted.map(([d,s])=>{
   const [id,ru,title,capacity,,,stack,note,noteEn]=d;
   const item=mk("article",null,"hw-device");
   const name=mk("h3"); const link=mk("a",t(ru,title)); link.href="#hw-"+id; name.append(link);
   const chips=mk("div",null,"hw-chips");
   if(!split)chips.append(mk("span",unknown&&s.memory!=="no"?t("Нужен замер кеша","Cache measurement needed"):labels.memory[s.memory],"hw-"+(unknown&&s.memory!=="no"?"tight":s.memory)));
   chips.append(mk("span",labels.price[s.price],"hw-"+s.price));
   if(!s.stack)chips.append(mk("span",t("Другой движок","Different backend"),"hw-no"));
   const price=priceLabel(d,en);
   item.append(name,mk("p",`${capacity} ${t("ГБ","GB")} · ${stacks[stack]} · ${price}`,"hw-meta"),chips,mk("p",t(note,noteEn)));
   const run=flashRun(id);
   if(run){
    const details=mk("details",null,"hw-run-details");
    details.append(mk("summary",split?t("Запуск возможен","Can run"):t("Тест Flash‑Next","Flash‑Next test")));
    const [ruBench,enBench,source]=run;
    const link=mk("a",id==="pro6000"?t("Практические примеры","Deployment examples"):t("Методика и замер","Method and result"));
    link.href=source;details.append(mk("p",t(ruBench,enBench)),link);
    item.append(details);
   }
   return item;
  }));
 }
 function applyProfile(){
  const profile=profiles[input("preset").value];
  const split=profile.layout==="split";
  by("hw-engineer").hidden=split;
  by("hw-overrides").disabled=split||!by("hw-engineer").open;
  input("weights").value=profile.weights;
  input("kv").value=profile.kv??"";
  input("reserve").value=profile.reserve;
  const select=input("context");
  select.replaceChildren(...contextOptions(profile.max).map(v=>{
    const opt=mk("option",fmt.format(v)+(v===profile.max?t(" · максимум модели"," · model maximum"):""));
    opt.value=v;return opt;
  }));
  select.value=String(profile.max);
  by("hw-profile-source").href=profile.source;
  const weightsLink=by("hw-weights-source");
  weightsLink.hidden=!profile.weightsSource;
  if(profile.weightsSource)weightsLink.href=profile.weightsSource;
  draw();
 }
 input("preset").addEventListener("change",applyProfile);
 by("hw-engineer").addEventListener("toggle",()=>{
  by("hw-overrides").disabled=profiles[input("preset").value].layout==="split"||!by("hw-engineer").open;draw();
 });
 form.addEventListener("input",draw);
 form.addEventListener("submit",event=>{event.preventDefault();draw();});
 form.addEventListener("reset",()=>setTimeout(applyProfile,0));
 applyProfile();
}
