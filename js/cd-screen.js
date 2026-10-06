/* Live Commerce Desk admin screens (1440×900), ported from the "CD Screen"
   Claude Design component. Fills every [data-cd-inner][data-cd-screen] with
   the matching view and scales it to its [data-cd-frame]. Exposes
   window.CdScreen.render(screen) for the demos page. */
(function () {
  const I = {
    grid: 'M3 3h8v8H3V3Zm10 0h8v5h-8V3ZM3 13h8v8H3v-8Zm10-3h8v11h-8V10Z',
    box: 'M12 2 3 6.5v11L12 22l9-4.5v-11L12 2Zm0 2.3 6.4 3.2L12 10.7 5.6 7.5 12 4.3Z',
    cart: 'M6 4h15l-2 9H8.4l.4 2H19v2H7l-.9-4.5L4.2 4H2V2h3l1 2Zm2 16a1.6 1.6 0 1 0 0 3.2A1.6 1.6 0 0 0 8 20Zm9 0a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Z',
    store: 'M4 4h16l1.4 5.2A3 3 0 0 1 18.5 13c-.8 0-1.5-.3-2-.8-.5.5-1.3.8-2 .8s-1.5-.3-2-.8c-.5.5-1.3.8-2 .8s-1.5-.3-2-.8c-.5.5-1.2.8-2 .8a3 3 0 0 1-2.9-3.8L4 4Zm1 10.7c.5.2 1 .3 1.5.3V21h11v-6c.5 0 1-.1 1.5-.3V22H5v-7.3Z',
    wallet: 'M3 6a3 3 0 0 1 3-3h11v3H6a1 1 0 0 0 0 2h13a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a3 3 0 0 1-3-3V6Zm14 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z',
    tag: 'M11 2h9v9l-9.5 9.5a2 2 0 0 1-2.8 0l-6.2-6.2a2 2 0 0 1 0-2.8L11 2Zm5.5 3a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Z',
    users: 'M8 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20v-1.6C2 15.9 4.7 14 8 14s6 1.9 6 4.4V20H2Zm14 0v-1.6c0-1.4-.5-2.6-1.4-3.5 2.9.2 5.4 1.8 5.4 4V20h-4Z',
    cog: 'M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm9.4 5.2-1.9-1.1a7.6 7.6 0 0 0 0-1.2l1.9-1.1-2-3.5-1.9 1.1a7.6 7.6 0 0 0-1-.6V4h-4v2.3a7.6 7.6 0 0 0-1 .6L9.5 5.8l-2 3.5 1.9 1.1a7.6 7.6 0 0 0 0 1.2l-1.9 1.1 2 3.5 1.9-1.1a7.6 7.6 0 0 0 1 .6V20h4v-2.3l1-.6 1.9 1.1 2-3.5Z',
    shield: 'M12 2 4 5v6.5c0 4.6 3.3 8.7 8 10.5 4.7-1.8 8-5.9 8-10.5V5l-8-3Z'
  };
  const st = {
    collected: { color: '#12805C', tint: '#E4F5EE' },
    pending: { color: '#2F5CFF', tint: '#EAF0FF' },
    risk: { color: '#B07A05', tint: '#FFF3D6' },
    failed: { color: '#C4341F', tint: '#FCE9E5' },
    idle: { color: '#5A6478', tint: '#F1F4F9' }
  };
  const card = 'background:#fff;border:1px solid #E8ECF4;border-radius:12px;box-shadow:0 6px 18px rgba(27,42,107,.05)';
  const pill = (text, color, tint, extra) => '<span style="font-size:11.5px;font-weight:600;padding:4px 10px;border-radius:999px;color:' + color + ';background:' + tint + (extra || '') + '">' + text + '</span>';

  function sidebar(screen) {
    const active = { dashboard: 'Dashboard', products: 'Products', orders: 'Orders' }[screen];
    const main = [['Dashboard', I.grid], ['Products', I.box], ['Orders', I.cart, '41'], ['Merchants', I.store], ['Deductions', I.wallet], ['Promos', I.tag]].map(([label, icon, count]) => {
      const on = label === active, color = on ? '#2F5CFF' : '#5A6478';
      return '<div style="display:flex;align-items:center;gap:11px;padding:10px 10px;border-radius:9px;margin-bottom:2px;background:' + (on ? '#EAF0FF' : 'transparent') + '">' +
        '<svg width="17" height="17" viewBox="0 0 24 24" fill="' + color + '"><path d="' + icon + '"></path></svg>' +
        '<div style="flex:1;font-size:13.5px;font-weight:' + (on ? 600 : 500) + ';color:' + color + '">' + label + '</div>' +
        (count ? '<div style="background:#EAF0FF;color:#2F5CFF;font-size:11px;font-weight:600;padding:1px 7px;border-radius:999px">' + count + '</div>' : '') +
        '</div>';
    }).join('');
    const sys = [['Users &amp; roles', I.users], ['Settings', I.cog], ['Audit log', I.shield]].map(([label, icon]) =>
      '<div style="display:flex;align-items:center;gap:11px;padding:10px;border-radius:9px;margin-bottom:2px">' +
      '<svg width="17" height="17" viewBox="0 0 24 24" fill="#8A94A6"><path d="' + icon + '"></path></svg>' +
      '<div style="font-size:13.5px;font-weight:500;color:#5A6478;white-space:nowrap">' + label + '</div></div>').join('');
    return '<aside style="width:236px;flex:none;background:#FFFFFF;border-right:1px solid #E8ECF4;display:flex;flex-direction:column;padding:22px 16px">' +
      '<div style="display:flex;align-items:center;gap:10px;padding:0 8px 22px"><div style="width:32px;height:32px;border-radius:9px;background:#2F5CFF;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:15px">C</div><div style="font-size:16px;font-weight:700;letter-spacing:-.3px">Commerce Desk</div></div>' +
      '<div style="font-size:11px;font-weight:600;color:#8A94A6;letter-spacing:.08em;text-transform:uppercase;padding:0 8px 10px">Operations</div>' + main +
      '<div style="font-size:11px;font-weight:600;color:#8A94A6;letter-spacing:.08em;text-transform:uppercase;padding:20px 8px 10px">System</div>' + sys +
      '<div style="margin-top:auto;background:#EAF0FF;border-radius:12px;padding:16px"><div style="font-size:13px;font-weight:600;margin-bottom:5px">Payroll cut-off</div><div style="font-size:11.5px;line-height:1.5;color:#5A6478">Cycle 07 closes in 3 days. 41 deductions pending review.</div></div>' +
      '</aside>';
  }

  function header(screen) {
    const [title, subtitle] = {
      dashboard: ['Dashboard', 'Cycle 07 · 3 days to payroll cut-off'],
      products: ['Products', '1,284 items across 96 merchants'],
      orders: ['Order detail', 'Settled by allotment deduction']
    }[screen];
    return '<header style="background:#fff;border-bottom:1px solid #E8ECF4;padding:16px 28px;display:flex;align-items:center;gap:22px">' +
      '<div style="flex:1;min-width:0"><div style="font-size:19px;font-weight:600;letter-spacing:-.3px">' + title + '</div><div style="font-size:12.5px;color:#8A94A6;margin-top:1px">' + subtitle + '</div></div>' +
      '<div style="width:280px;height:38px;border-radius:9px;background:#F4F6FA;display:flex;align-items:center;gap:9px;padding:0 13px"><svg width="15" height="15" viewBox="0 0 24 24" fill="#8A94A6"><path d="M10 2a8 8 0 1 0 4.9 14.3l5.4 5.4 1.4-1.4-5.4-5.4A8 8 0 0 0 10 2Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z"></path></svg><div style="font-size:12.5px;color:#8A94A6;white-space:nowrap">Search records</div></div>' +
      '<div style="display:flex;align-items:center;gap:10px">' +
        '<div style="width:38px;height:38px;border-radius:9px;background:#F4F6FA;display:flex;align-items:center;justify-content:center;position:relative"><svg width="17" height="17" viewBox="0 0 24 24" fill="#5A6478"><path d="M12 2a6 6 0 0 0-6 6v3.6L4.4 15a1 1 0 0 0 .9 1.5h13.4a1 1 0 0 0 .9-1.5L18 11.6V8a6 6 0 0 0-6-6Zm0 20a3 3 0 0 0 2.8-2H9.2A3 3 0 0 0 12 22Z"></path></svg><div style="position:absolute;top:8px;right:9px;width:7px;height:7px;border-radius:50%;background:#F0503C;box-shadow:0 0 0 2px #F4F6FA"></div></div>' +
        '<div style="display:flex;align-items:center;gap:9px;padding-left:6px"><div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(140deg,#8FA6FF,#2F5CFF);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600">JM</div><div><div style="font-size:13px;font-weight:600;line-height:1.2">Jhoanna M.</div><div style="font-size:11px;color:#8A94A6">Operations lead</div></div></div>' +
      '</div></header>';
  }

  function dashboard() {
    const metrics = [
      ['Open orders', '412', '38 awaiting review', '+6%', st.collected],
      ['Collected this cycle', '₱1.94M', 'of ₱2.31M scheduled', '84%', st.pending],
      ['Active merchants', '96', '7 pending approval', '+3', st.collected],
      ['At-risk schedules', '18', 'contract ending soon', 'Review', st.risk]
    ].map(([label, value, meta, delta, tone]) =>
      '<div style="flex:1;' + card + ';padding:17px 18px">' +
      '<div style="display:flex;align-items:center;justify-content:space-between"><div style="font-size:12.5px;color:#8A94A6;font-weight:500;white-space:nowrap">' + label + '</div><div style="font-size:11px;font-weight:600;padding:2px 8px;border-radius:999px;white-space:nowrap;color:' + tone.color + ';background:' + tone.tint + '">' + delta + '</div></div>' +
      '<div style="font-size:28px;font-weight:700;letter-spacing:-.8px;margin-top:8px;font-variant-numeric:tabular-nums">' + value + '</div>' +
      '<div style="font-size:11.5px;color:#8A94A6;margin-top:3px">' + meta + '</div></div>').join('');

    const fills = [72, 80, 64, 88, 76, 92, 68, 84, 58, 90, 74, 46];
    const bars = fills.map((f, i) =>
      '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:7px;height:100%;justify-content:flex-end">' +
      '<div style="width:100%;display:flex;align-items:flex-end;gap:3px;height:' + (58 + (i % 4) * 12) + '%">' +
      '<div style="flex:1;height:100%;border-radius:5px 5px 0 0;background:#EAF0FF"></div>' +
      '<div style="flex:1;height:' + f + '%;border-radius:5px 5px 0 0;background:' + (i === 11 ? '#FFC845' : '#2F5CFF') + '"></div>' +
      '</div></div>').join('');
    const labels = fills.map((f, i) => '<div style="flex:1;text-align:center;font-size:10.5px;color:#8A94A6;font-weight:500">C' + (i + 1) + '</div>').join('');
    const legend = [['#EAF0FF', 'Scheduled'], ['#2F5CFF', 'Collected'], ['#FFC845', 'At risk']].map(([c, l]) =>
      '<div style="display:flex;align-items:center;gap:7px;font-size:12px;color:#5A6478;font-weight:500"><span style="width:9px;height:9px;border-radius:3px;background:' + c + '"></span>' + l + '</div>').join('');

    const alerts = [
      ['ORD-24817 · R. Dela Cruz', 'Contract ends before cycle 09', 'At risk', st.risk],
      ['ORD-24790 · M. Bautista', 'Allotment reduced mid-schedule', 'At risk', st.risk],
      ['ORD-24755 · J. Santos', 'Disembarked · 2 cycles unpaid', 'Failed', st.failed],
      ['ORD-24731 · A. Villamor', 'Over capacity by ₱2,400', 'Blocked', st.failed]
    ].map(([title, meta, tag, tone]) =>
      '<div style="display:flex;align-items:center;gap:11px;padding:11px 0;border-bottom:1px solid #F1F4F9">' +
      '<div style="width:8px;height:8px;border-radius:50%;flex:none;background:' + tone.color + '"></div>' +
      '<div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:600">' + title + '</div><div style="font-size:11.5px;color:#8A94A6">' + meta + '</div></div>' +
      '<div style="font-size:11px;font-weight:600;padding:3px 9px;border-radius:999px;white-space:nowrap;color:' + tone.color + ';background:' + tone.tint + '">' + tag + '</div></div>').join('');

    return '<div style="display:flex;gap:16px">' + metrics + '</div>' +
      '<div style="display:flex;gap:16px;flex:1;min-height:0">' +
        '<div style="flex:1.55;' + card + ';padding:20px;display:flex;flex-direction:column">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px"><div><div style="font-size:15px;font-weight:600">Deduction collection by cycle</div><div style="font-size:12px;color:#8A94A6;margin-top:2px">Scheduled vs collected · last 12 payroll cycles</div></div>' +
          '<div style="display:flex;gap:6px;background:#F4F6FA;border-radius:9px;padding:4px"><div style="font-size:12px;font-weight:600;padding:5px 12px;border-radius:7px;background:#fff;color:#2F5CFF;box-shadow:0 1px 3px rgba(27,34,51,.1)">Cycle</div><div style="font-size:12px;font-weight:500;padding:5px 12px;color:#8A94A6">Month</div></div></div>' +
          '<div style="flex:1;min-height:0;display:flex;align-items:flex-end;gap:14px;padding-top:18px;border-bottom:1px solid #E8ECF4">' + bars + '</div>' +
          '<div style="display:flex;gap:14px;padding-top:9px">' + labels + '</div>' +
          '<div style="display:flex;gap:18px;padding-top:12px">' + legend + '</div>' +
        '</div>' +
        '<div style="flex:1;display:flex;flex-direction:column;gap:16px;min-width:0">' +
          '<div style="background:#2F5CFF;border-radius:12px;padding:20px;color:#fff"><div style="font-size:12.5px;font-weight:500;opacity:.86">Committed against allotment</div><div style="font-size:30px;font-weight:700;letter-spacing:-1px;margin:7px 0 14px;font-variant-numeric:tabular-nums">₱4.28M</div>' +
          '<div style="height:9px;border-radius:999px;background:rgba(255,255,255,.24);overflow:hidden;display:flex"><div style="width:63%;background:#fff"></div><div style="width:14%;background:#FFC845"></div></div>' +
          '<div style="display:flex;justify-content:space-between;margin-top:10px;font-size:11.5px;font-weight:500;opacity:.9"><span style="white-space:nowrap">63% collected</span><span style="white-space:nowrap">14% at risk</span></div></div>' +
          '<div style="flex:1;min-height:0;' + card + ';padding:18px;display:flex;flex-direction:column"><div style="font-size:15px;font-weight:600;margin-bottom:4px">Needs attention</div><div style="font-size:12px;color:#8A94A6;margin-bottom:12px">Schedules interrupted this cycle</div>' + alerts + '</div>' +
        '</div>' +
      '</div>';
  }

  function products() {
    const tabs = [['All', 1], ['Active', 0], ['Low stock', 0], ['Unpublished', 0]].map(([label, on]) =>
      '<div style="font-size:12.5px;font-weight:' + (on ? 600 : 500) + ';padding:6px 14px;border-radius:7px;white-space:nowrap;color:' + (on ? '#2F5CFF' : '#8A94A6') + ';background:' + (on ? '#EAF0FF' : 'transparent') + '">' + label + '</div>').join('');
    const tool = 'display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:500;color:#5A6478;background:#fff;border:1px solid #E8ECF4;border-radius:9px;padding:9px 14px;white-space:nowrap';
    const bulk = ['Edit price', 'Change category', 'Set stock'].map((l) =>
      '<div style="font-size:12px;font-weight:500;background:#fff;border:1px solid #C9D8FF;color:#2F5CFF;border-radius:7px;padding:5px 11px;white-space:nowrap">' + l + '</div>').join('');
    const rows = [
      ['Marine work gloves', 'Pair · size L', 'MWG-441', 'Pacific Supply', '₱480', '124', 'Workwear', 'Active', st.collected, 1, 0],
      ['Insulated flask 1L', 'Steel · navy', 'FLK-118', 'Dela Cruz Store', '₱1,250', '42', 'Galley', 'Active', st.collected, 1, 1],
      ['Prepaid load card ₱500', 'Digital', 'LOD-500', 'Crewlink', '₱505', '∞', 'Connectivity', 'Active', st.collected, 1, 0],
      ['Safety boots S3', 'Size 42', 'BOT-042', 'Pacific Supply', '₱3,100', '8', 'Workwear', 'Low stock', st.risk, 1, 0],
      ['Rice 25kg sack', 'Premium', 'RIC-025', 'Bautista Trading', '₱1,890', '61', 'Grocery', 'Active', st.collected, 1, 0],
      ['Powerbank 20000mAh', 'USB-C', 'PWB-200', 'Crewlink', '₱1,640', '19', 'Electronics', 'Active', st.collected, 1, 0],
      ['Family care package', 'Standard', 'FCP-001', 'Villamor Goods', '₱4,200', '30', 'Bundles', 'Unpublished', st.idle, 0, 0],
      ['Toiletries kit', 'Travel size', 'TOI-009', 'Dela Cruz Store', '₱620', '4', 'Personal', 'Low stock', st.risk, 0, 0],
      ['Deck coveralls', 'Size M', 'COV-M01', 'Pacific Supply', '₱2,340', '27', 'Workwear', 'Active', st.collected, 0, 0]
    ].map(([name, variant, sku, merchant, price, stock, category, status, tone, checked, editing], i) =>
      '<div style="display:flex;align-items:center;gap:16px;padding:11px 18px;border-bottom:1px solid #F1F4F9;font-size:13px;background:' + (editing ? '#F8FAFF' : (checked ? '#FBFCFF' : '#fff')) + '">' +
      '<div style="width:16px;height:16px;border-radius:4px;flex:none;border:2px solid ' + (checked ? '#2F5CFF' : '#C9CFDC') + ';background:' + (checked ? '#2F5CFF' : 'transparent') + '"></div>' +
      '<div style="width:250px;display:flex;align-items:center;gap:10px;min-width:0"><div style="width:32px;height:32px;border-radius:8px;flex:none;background:' + ['#EAF0FF', '#E4F5EE', '#FFF3D6', '#F1F4F9'][i % 4] + '"></div><div style="min-width:0"><div style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + name + '</div><div style="font-size:11px;color:#8A94A6">' + variant + '</div></div></div>' +
      '<div style="width:120px;color:#5A6478;font-variant-numeric:tabular-nums">' + sku + '</div>' +
      '<div style="width:130px;color:#5A6478;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + merchant + '</div>' +
      '<div style="width:96px;text-align:right;font-weight:600;font-variant-numeric:tabular-nums;border-radius:6px;padding:3px 0;border:' + (editing ? '2px solid #2F5CFF' : '2px solid transparent') + ';background:' + (editing ? '#fff' : 'transparent') + '">' + price + '</div>' +
      '<div style="width:74px;text-align:right;font-variant-numeric:tabular-nums;color:#5A6478">' + stock + '</div>' +
      '<div style="width:110px;color:#5A6478">' + category + '</div>' +
      '<div style="flex:1">' + pill(status, tone.color, tone.tint) + '</div></div>').join('');
    const pg = (t, on, c) => '<div style="width:30px;height:30px;border-radius:7px;' + (on ? 'background:#2F5CFF;color:#fff;font-weight:600' : 'border:1px solid #E8ECF4;color:' + c) + ';display:flex;align-items:center;justify-content:center;font-size:12px">' + t + '</div>';

    return '<div style="display:flex;align-items:center;gap:10px">' +
        '<div style="display:flex;gap:6px;background:#fff;border:1px solid #E8ECF4;border-radius:9px;padding:4px">' + tabs + '</div>' +
        '<div style="flex:1"></div>' +
        '<div style="' + tool + '"><svg width="15" height="15" viewBox="0 0 24 24" fill="#5A6478"><path d="M3 5h18v2H3V5Zm3 6h12v2H6v-2Zm4 6h4v2h-4v-2Z"></path></svg>Filters · 2</div>' +
        '<div style="' + tool + '"><svg width="15" height="15" viewBox="0 0 24 24" fill="#5A6478"><path d="M12 3v10.6l3.3-3.3 1.4 1.4L11 17.4 5.3 11.7l1.4-1.4L10 13.6V3h2ZM4 19h16v2H4v-2Z"></path></svg>Export CSV</div>' +
        '<div style="display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:600;color:#fff;background:#2F5CFF;border-radius:9px;padding:10px 16px;white-space:nowrap">＋ New product</div>' +
      '</div>' +
      '<div style="flex:1;min-height:0;' + card + ';overflow:hidden;display:flex;flex-direction:column">' +
        '<div style="display:flex;align-items:center;gap:14px;padding:12px 18px;background:#EAF0FF;border-bottom:1px solid #E8ECF4"><div style="font-size:12.5px;font-weight:600;color:#2F5CFF;white-space:nowrap">6 products selected</div><div style="display:flex;gap:8px">' + bulk + '</div></div>' +
        '<div style="display:flex;align-items:center;gap:16px;padding:11px 18px;border-bottom:1px solid #E8ECF4;font-size:11.5px;font-weight:600;color:#8A94A6;letter-spacing:.03em">' +
          '<div style="width:16px;height:16px;border-radius:4px;border:2px solid #2F5CFF;background:#2F5CFF;flex:none"></div>' +
          '<div style="width:250px">PRODUCT</div><div style="width:120px">SKU</div><div style="width:130px">MERCHANT</div><div style="width:96px;text-align:right">PRICE</div><div style="width:74px;text-align:right">STOCK</div><div style="width:110px">CATEGORY</div><div style="flex:1">STATUS</div>' +
        '</div>' + rows +
        '<div style="margin-top:auto;display:flex;align-items:center;justify-content:space-between;padding:13px 18px;border-top:1px solid #E8ECF4"><div style="font-size:12.5px;color:#8A94A6;white-space:nowrap">Showing 1–9 of 1,284 · saved view “Low stock, active merchants”</div>' +
        '<div style="display:flex;gap:6px">' + pg('‹', 0, '#8A94A6') + pg('1', 1) + pg('2', 0, '#5A6478') + pg('3', 0, '#5A6478') + pg('›', 0, '#8A94A6') + '</div></div>' +
      '</div>';
  }

  function orders() {
    const schedule = [
      ['Cycle 05', '28 Feb 2024', 'Collected', 'On schedule', st.collected],
      ['Cycle 06', '15 Mar 2024', 'Collected', 'On schedule', st.collected],
      ['Cycle 07', '31 Mar 2024', 'Scheduled', 'Current cycle', st.pending],
      ['Cycle 08', '15 Apr 2024', 'At risk', 'Contract ends 09 Apr', st.risk]
    ].map(([cycle, date, status, note, tone]) =>
      '<div style="display:flex;align-items:center;gap:16px;padding:13px 20px;border-bottom:1px solid #F1F4F9;font-size:13px">' +
      '<div style="width:96px;font-weight:600">' + cycle + '</div><div style="width:130px;color:#5A6478">' + date + '</div>' +
      '<div style="width:104px;text-align:right;font-weight:600;font-variant-numeric:tabular-nums">₱8,100</div>' +
      '<div style="flex:1">' + pill(status, tone.color, tone.tint) + '</div><div style="width:150px;font-size:11.5px;color:#8A94A6">' + note + '</div></div>').join('');
    const history = [
      ['Address corrected', 'Jhoanna M. · 21 Feb, 09:14'],
      ['Deduction split 6 → 4 cycles', 'Jhoanna M. · 18 Feb, 16:02'],
      ['Status set to Delivered', 'System · 17 Feb, 11:40'],
      ['Placed via allotment', 'R. Dela Cruz · 14 Feb, 08:22']
    ].map(([what, who]) =>
      '<div style="display:flex;gap:11px;padding:9px 0;border-bottom:1px solid #F1F4F9"><div style="width:7px;height:7px;border-radius:50%;background:#C9D8FF;margin-top:6px;flex:none"></div>' +
      '<div style="min-width:0"><div style="font-size:12.5px;font-weight:500;line-height:1.45">' + what + '</div><div style="font-size:11.5px;color:#8A94A6;margin-top:3px;line-height:1.45">' + who + '</div></div></div>').join('');
    const legendDot = (c, l) => '<div style="display:flex;align-items:center;gap:6px;white-space:nowrap"><span style="width:9px;height:9px;border-radius:3px;background:' + c + ';flex:none"></span>' + l + '</div>';

    return '<div style="display:flex;gap:16px;flex:1;min-height:0">' +
      '<div style="flex:1.5;display:flex;flex-direction:column;gap:16px;min-width:0">' +
        '<div style="' + card + ';padding:20px"><div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px"><div>' +
          '<div style="display:flex;align-items:center;gap:10px"><div style="font-size:19px;font-weight:600;letter-spacing:-.3px">Order #ORD-24817</div>' + pill('Delivered', '#12805C', '#E4F5EE') + pill('Deductions running', '#2F5CFF', '#EAF0FF', ';white-space:nowrap') + '</div>' +
          '<div style="font-size:12.5px;color:#8A94A6;margin-top:6px">Placed 14 Feb 2024 · settled by allotment deduction · 4 cycles</div></div>' +
          '<div style="text-align:right"><div style="font-size:12px;color:#8A94A6">Order total</div><div style="font-size:26px;font-weight:700;letter-spacing:-.8px;font-variant-numeric:tabular-nums">₱32,400</div></div>' +
        '</div></div>' +
        '<div style="flex:1;min-height:0;' + card + ';overflow:hidden;display:flex;flex-direction:column">' +
          '<div style="padding:17px 20px 13px;border-bottom:1px solid #E8ECF4"><div style="font-size:15px;font-weight:600">Deduction schedule</div><div style="font-size:12px;color:#8A94A6;margin-top:2px">₱8,100 per cycle against the buyer\'s allotment</div></div>' +
          '<div style="display:flex;align-items:center;gap:16px;padding:10px 20px;border-bottom:1px solid #E8ECF4;font-size:11.5px;font-weight:600;color:#8A94A6"><div style="width:96px">CYCLE</div><div style="width:130px">PAYROLL DATE</div><div style="width:104px;text-align:right">AMOUNT</div><div style="flex:1">STATUS</div><div style="width:150px">NOTE</div></div>' +
          schedule +
          '<div style="margin-top:auto;display:flex;align-items:center;gap:12px;padding:14px 20px;background:#FFF8E8;border-top:1px solid #F6E4B8">' +
            '<svg width="17" height="17" viewBox="0 0 24 24" fill="#B07A05"><path d="M12 2 1 21h22L12 2Zm1 14h-2v2h2v-2Zm0-7h-2v5h2V9Z"></path></svg>' +
            '<div style="font-size:12.5px;color:#6B5410;line-height:1.5">Contract ends before cycle 09. Remaining ₱8,100 needs a settlement decision before disembarkation.</div>' +
            '<div style="margin-left:auto;font-size:12px;font-weight:600;color:#1B2233;background:#FFC845;border-radius:8px;padding:8px 14px;white-space:nowrap">Resolve</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div style="flex:1;display:flex;flex-direction:column;gap:16px;min-width:0">' +
        '<div style="' + card + ';padding:20px"><div style="font-size:15px;font-weight:600;margin-bottom:14px">Buyer</div>' +
          '<div style="display:flex;align-items:center;gap:12px"><div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(140deg,#8FA6FF,#2F5CFF);color:#fff;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:600">RD</div><div><div style="font-size:14px;font-weight:600">Reymar Dela Cruz</div><div style="font-size:12px;color:#8A94A6">2/O · MV Pacific Dawn</div></div></div>' +
          '<div style="display:flex;gap:8px;margin-top:14px">' + pill('Buyer', '#2F5CFF', '#EAF0FF') + pill('Allottee of 1', '#5A6478', '#F1F4F9', ';white-space:nowrap') + pill('Merchant', '#12805C', '#E4F5EE') + '</div>' +
        '</div>' +
        '<div style="' + card + ';padding:20px"><div style="font-size:15px;font-weight:600">Allotment commitment</div><div style="font-size:12px;color:#8A94A6;margin-top:2px;margin-bottom:16px">Across all open orders</div>' +
          '<div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:9px"><div style="font-size:24px;font-weight:700;letter-spacing:-.7px;font-variant-numeric:tabular-nums">₱24,300</div><div style="font-size:12.5px;color:#8A94A6;white-space:nowrap">of ₱38,000 capacity</div></div>' +
          '<div style="height:10px;border-radius:999px;background:#F1F4F9;overflow:hidden;display:flex"><div style="width:64%;background:#2F5CFF"></div><div style="width:15%;background:#FFC845"></div></div>' +
          '<div style="display:flex;gap:16px;margin-top:12px;font-size:11.5px;color:#5A6478;font-weight:500">' + legendDot('#2F5CFF', 'This order') + legendDot('#FFC845', 'Other orders') + '</div>' +
        '</div>' +
        '<div style="flex:1;min-height:0;' + card + ';padding:20px;display:flex;flex-direction:column"><div style="font-size:15px;font-weight:600;margin-bottom:12px">Change history</div>' + history + '</div>' +
      '</div>' +
    '</div>';
  }

  function render(screen) {
    const s = { products: 1, orders: 1 }[screen] ? screen : 'dashboard';
    const body = s === 'products' ? products() : s === 'orders' ? orders() : dashboard();
    return '<div style="width:1440px;height:900px;background:#F4F6FA;display:flex;font-family:\'Poppins\',system-ui,sans-serif;color:#1B2233;-webkit-font-smoothing:antialiased;overflow:hidden;border-radius:16px;box-shadow:0 30px 70px -24px rgba(27,34,51,.3);text-align:left;line-height:normal">' +
      sidebar(s) +
      '<div style="flex:1;min-width:0;display:flex;flex-direction:column">' + header(s) +
      '<div style="flex:1;min-height:0;overflow:hidden;padding:22px 28px;display:flex;flex-direction:column;gap:18px">' + body + '</div>' +
      '</div></div>';
  }

  window.CdScreen = { render };

  function mount() {
    const frames = document.querySelectorAll('[data-cd-frame]');
    if (!frames.length) return;
    frames.forEach((fr) => {
      const inner = fr.querySelector('[data-cd-inner]');
      if (inner && inner.dataset.cdScreen) inner.innerHTML = render(inner.dataset.cdScreen);
    });
    const fit = () => frames.forEach((fr) => {
      const inner = fr.querySelector('[data-cd-inner]');
      if (inner) inner.style.transform = 'scale(' + (fr.clientWidth / 1440).toFixed(4) + ')';
    });
    const ro = new ResizeObserver(fit);
    frames.forEach((fr) => ro.observe(fr));
    fit();
    window.addEventListener('pagehide', () => ro.disconnect(), { once: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
