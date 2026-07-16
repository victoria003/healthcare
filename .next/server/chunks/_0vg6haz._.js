module.exports=[3848,55038,96547,e=>{"use strict";e.i(59661),e.i(30219),e.i(81619),e.i(37730),e.i(52766);var t=e.i(82087);function a(e){let t=[];try{e.SKILLS&&(t="string"==typeof e.SKILLS?JSON.parse(e.SKILLS):Array.isArray(e.SKILLS)?e.SKILLS:[])}catch{t=[]}let a=(e.ROLE||e.role||"").toLowerCase(),r="Caregivers";return a.includes("nurse")||"nursing"===a?r="Nurses":a.includes("doctor")||a.includes("physician")||a.includes("specialist")?r="Doctors":a.includes("physiotherapist")||a.includes("physio")?r="Physiotherapists":t.some(e=>e.toLowerCase().includes("icu")||e.toLowerCase().includes("nurs"))&&(r="Nurses"),{id:e.STAFF_ID||e.staff_id,agencyId:e.AGENCY_ID||e.agency_id,fullName:e.FULL_NAME||e.full_name,email:e.EMAIL||e.email,phone:e.PHONE_NUMBER||e.phone_number||e.phone,avatarUrl:e.AVATAR_URL||e.avatar_url||"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",category:r,role:e.ROLE||e.role||"Caregiver",organization:e.AGENCY_NAME||e.agency_name||"HomeCare Partner",rating:Number(e.RATING||e.rating||5),experienceYears:Number(e.EXPERIENCE_YEARS||e.experience_years||2),status:e.STATUS||e.status||"active",skills:t}}e.i(77592),e.i(40376),e.i(7682),e.i(6203),e.i(43211),e.i(74736),e.s(["ProfessionalRepository",0,{async getAll(){let e=`
      SELECT 
        p.PROFESSIONAL_ID as STAFF_ID,
        p.FIRST_NAME || ' ' || p.LAST_NAME as FULL_NAME,
        p.EMAIL,
        p.PHONE,
        pc.CATEGORY_CODE as ROLE,
        sm.SPECIALIZATION_NAME as SKILLS,
        p.EXPERIENCE_YEARS,
        p.VERIFICATION_STATUS_ID,
        5.0 as RATING,
        'active' as STATUS,
        '' as AVATAR_URL,
        NULL as AGENCY_ID,
        '' as AGENCY_NAME
      FROM CORE.PROFESSIONAL p
      LEFT JOIN CORE.PROFESSIONAL_CATEGORY_MASTER pc ON p.PROFESSIONAL_CATEGORY_ID = pc.PROFESSIONAL_CATEGORY_ID
      LEFT JOIN CORE.SPECIALIZATION_MASTER sm ON p.SPECIALIZATION_ID = sm.SPECIALIZATION_ID;
    `;return(await (0,t.executeQuery)(e)).map(a)},async findById(e){let r=`
      SELECT 
        p.PROFESSIONAL_ID as STAFF_ID,
        p.FIRST_NAME || ' ' || p.LAST_NAME as FULL_NAME,
        p.EMAIL,
        p.PHONE,
        pc.CATEGORY_CODE as ROLE,
        sm.SPECIALIZATION_NAME as SKILLS,
        p.EXPERIENCE_YEARS,
        p.VERIFICATION_STATUS_ID,
        5.0 as RATING,
        'active' as STATUS,
        '' as AVATAR_URL,
        NULL as AGENCY_ID,
        '' as AGENCY_NAME
      FROM CORE.PROFESSIONAL p
      LEFT JOIN CORE.PROFESSIONAL_CATEGORY_MASTER pc ON p.PROFESSIONAL_CATEGORY_ID = pc.PROFESSIONAL_CATEGORY_ID
      LEFT JOIN CORE.SPECIALIZATION_MASTER sm ON p.SPECIALIZATION_ID = sm.SPECIALIZATION_ID
      WHERE p.PROFESSIONAL_ID = ?;
    `,i=await (0,t.executeQuery)(r,[e]);return i[0]?a(i[0]):void 0},findByAgency:async e=>[],async create(e){let r=e.fullName.split(" "),i=r[0],n=r.slice(1).join(" ")||"",s=`
      INSERT INTO CORE.PROFESSIONAL (
        FIRST_NAME, LAST_NAME, EMAIL, PHONE, EXPERIENCE_YEARS, PROFESSIONAL_CATEGORY_ID, SPECIALIZATION_ID, VERIFICATION_STATUS_ID, CREATED_AT
      ) VALUES (?, ?, ?, ?, ?, 1, 1, 1, CURRENT_TIMESTAMP());
    `;await (0,t.executeQuery)(s,[i,n,e.email,e.phone,e.experienceYears]);let o=`
      SELECT 
        p.PROFESSIONAL_ID as STAFF_ID,
        p.FIRST_NAME || ' ' || p.LAST_NAME as FULL_NAME,
        p.EMAIL,
        p.PHONE,
        pc.CATEGORY_CODE as ROLE,
        sm.SPECIALIZATION_NAME as SKILLS,
        p.EXPERIENCE_YEARS,
        p.VERIFICATION_STATUS_ID,
        5.0 as RATING,
        'active' as STATUS,
        '' as AVATAR_URL,
        NULL as AGENCY_ID,
        '' as AGENCY_NAME
      FROM CORE.PROFESSIONAL p
      LEFT JOIN CORE.PROFESSIONAL_CATEGORY_MASTER pc ON p.PROFESSIONAL_CATEGORY_ID = pc.PROFESSIONAL_CATEGORY_ID
      LEFT JOIN CORE.SPECIALIZATION_MASTER sm ON p.SPECIALIZATION_ID = sm.SPECIALIZATION_ID
      WHERE p.EMAIL = ?;
    `,E=await (0,t.executeQuery)(o,[e.email]);if(!E||0===E.length)throw Error("Failed to retrieve created professional.");return a(E[0])},async update(e,a){let r=[],i=[];if(a.fullName){let e=a.fullName.split(" ");r.push("FIRST_NAME = ?"),i.push(e[0]),r.push("LAST_NAME = ?"),i.push(e.slice(1).join(" "))}if(a.email&&(r.push("EMAIL = ?"),i.push(a.email)),a.phone&&(r.push("PHONE = ?"),i.push(a.phone)),void 0!==a.experienceYears&&(r.push("EXPERIENCE_YEARS = ?"),i.push(a.experienceYears)),r.length>0){i.push(e);let a=`UPDATE CORE.PROFESSIONAL SET ${r.join(", ")} WHERE PROFESSIONAL_ID = ?`;await (0,t.executeQuery)(a,i)}return this.findById(e)},async delete(e){await (0,t.executeQuery)("DELETE FROM CORE.PROFESSIONAL WHERE PROFESSIONAL_ID = ?",[e])}}],55038),e.s(["PatientRepository",0,{async getAll(){let e=`
      SELECT 
        p.PATIENT_ID,
        u.EMAIL,
        u.FULL_NAME,
        u.PHONE_NUMBER,
        u.AVATAR_URL
      FROM CORE.PATIENT_PROFILES p
      JOIN CORE.USERS u ON p.PATIENT_ID = u.USER_ID;
    `;return(await (0,t.executeQuery)(e)).map(e=>{let t=(e.FULL_NAME||e.full_name||"Demo Patient").split(" "),a=t[0]||"",r=t.slice(1).join(" ")||"";return{id:e.PATIENT_ID||e.patient_id,firstName:a,lastName:r,email:e.EMAIL||e.email||"",phone:e.PHONE_NUMBER||e.phone_number||e.phone||"",profilePhoto:e.AVATAR_URL||e.avatar_url||""}})},async getPatient(e){let t=await this.getProfile(e);return t?.patient},async getProfile(e){let a=`
      SELECT 
        p.PATIENT_ID,
        p.MEDICAL_HISTORY,
        p.ALLERGIES,
        p.BLOOD_GROUP,
        u.EMAIL,
        u.FULL_NAME,
        u.PHONE_NUMBER,
        u.AVATAR_URL
      FROM CORE.PATIENT_PROFILES p
      JOIN CORE.USERS u ON p.PATIENT_ID = u.USER_ID
      WHERE p.PATIENT_ID = ?;
    `,r=await (0,t.executeQuery)(a,[e]);return r[0]?function(e){let t=(e.FULL_NAME||"Demo Patient").split(" "),a=t[0]||"",r=t.slice(1).join(" ")||"",i=[];try{e.ALLERGIES&&(i="string"==typeof e.ALLERGIES?JSON.parse(e.ALLERGIES):Array.isArray(e.ALLERGIES)?e.ALLERGIES:[])}catch{i=[]}return{patient:{id:e.PATIENT_ID||e.patient_id,firstName:a,lastName:r,email:e.EMAIL||e.email||"",phone:e.PHONE_NUMBER||e.phone_number||e.phone||"",profilePhoto:e.AVATAR_URL||e.avatar_url||""},dateOfBirth:"1990-01-01",gender:"Male",bloodGroup:e.BLOOD_GROUP||e.blood_group||"O+",address:{street:"123 Care Street",city:"Hyderabad",state:"Telangana",postalCode:"500081",country:"India"},medicalHistory:e.MEDICAL_HISTORY||e.medical_history||"",allergies:i}}(r[0]):void 0},async create(e){let a=e.medicalHistory||"",r=JSON.stringify(e.allergies||[]),i=e.bloodGroup||"",n=`
      INSERT INTO CORE.PATIENT_PROFILES (PATIENT_ID, MEDICAL_HISTORY, ALLERGIES, BLOOD_GROUP, CREATED_AT, UPDATED_AT)
      VALUES (?, ?, PARSE_JSON(?), ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
    `;await (0,t.executeQuery)(n,[e.patientId,a,r,i]);let s=await this.getProfile(e.patientId);if(!s)throw Error("Failed to retrieve created patient profile.");return s}}],96547),e.s([],3848)},25586,e=>{"use strict";var t=e.i(47909),a=e.i(74017),r=e.i(96250),i=e.i(59756),n=e.i(61916),s=e.i(74677),o=e.i(19163),E=e.i(16795),l=e.i(87718),u=e.i(95169),A=e.i(47587),p=e.i(66012),R=e.i(70101),I=e.i(26937),c=e.i(10372),d=e.i(93695);e.i(52474);var N=e.i(220),O=e.i(89171);e.i(3848);var S=e.i(30219),T=e.i(77592);async function _(e,{params:t}){try{let{id:a}=await t,{documentType:r,fileUrl:i,fileName:n}=await e.json();if(!r||!i)return O.NextResponse.json({success:!1,error:"Document Type and File Url are required"},{status:400});let s=await S.AgencyRepository.findById(a);if(!s)return O.NextResponse.json({success:!1,error:"Agency profile not found"},{status:404});let o=await S.AgencyRepository.saveDocument(a,{type:r,fileUrl:i,fileName:n||`${r}.pdf`});return await T.AuditRepository.createLog(s.ownerName,"Document Uploaded",`Agency uploaded sensitive ${r.toUpperCase()} document. Verification pending.`,e.headers.get("x-forwarded-for")||"127.0.0.1"),O.NextResponse.json({success:!0,document:o})}catch(e){return O.NextResponse.json({success:!1,error:e.message},{status:500})}}e.s(["POST",0,_],29482);var L=e.i(29482);let C=new t.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/agencies/[id]/documents/route",pathname:"/api/agencies/[id]/documents",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/agencies/[id]/documents/route.ts",nextConfigOutput:"",userland:L,...{}}),{workAsyncStorage:h,workUnitAsyncStorage:P,serverHooks:m}=C;async function y(e,t,r){r.requestMeta&&(0,i.setRequestMeta)(e,r.requestMeta),C.isDev&&(0,i.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let O="/api/agencies/[id]/documents/route";O=O.replace(/\/index$/,"")||"/";let S=await C.prepare(e,t,{srcPage:O,multiZoneDraftMode:!1});if(!S)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:T,deploymentId:_,params:L,nextConfig:h,parsedUrl:P,isDraftMode:m,prerenderManifest:y,routerServerContext:f,isOnDemandRevalidate:g,revalidateOnlyGenerated:M,resolvedPathname:D,clientReferenceManifest:F,serverActionsManifest:v}=S,U=(0,o.normalizeAppPath)(O),w=!!(y.dynamicRoutes[U]||y.routes[D]),x=async()=>((null==f?void 0:f.render404)?await f.render404(e,t,P,!1):t.end("This page could not be found"),null);if(w&&!m){let e=!!y.routes[D],t=y.dynamicRoutes[U];if(t&&!1===t.fallback&&!e){if(h.adapterPath)return await x();throw new d.NoFallbackError}}let G=null;!w||C.isDev||m||(G="/index"===(G=D)?"/":G);let H=!0===C.isDev||!w,Y=w&&!H;v&&F&&(0,s.setManifestsSingleton)({page:O,clientReferenceManifest:F,serverActionsManifest:v});let b=e.method||"GET",q=(0,n.getTracer)(),B=q.getActiveScopeSpan(),V=!!(null==f?void 0:f.isWrappedByNextServer),j=!!(0,i.getRequestMeta)(e,"minimalMode"),K=(0,i.getRequestMeta)(e,"incrementalCache")||await C.getIncrementalCache(e,h,y,j);null==K||K.resetRequestCache(),globalThis.__incrementalCache=K;let Z={params:L,previewProps:y.preview,renderOpts:{experimental:{authInterrupts:!!h.experimental.authInterrupts},cacheComponents:!!h.cacheComponents,supportsDynamicResponse:H,incrementalCache:K,cacheLifeProfiles:h.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r,i)=>C.onRequestError(e,t,r,i,f)},sharedContext:{buildId:T,deploymentId:_}},k=new E.NodeNextRequest(e),J=new E.NodeNextResponse(t),$=l.NextRequestAdapter.fromNodeNextRequest(k,(0,l.signalFromNodeResponse)(t));try{let i,s=async e=>C.handle($,Z).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=q.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=a.get("next.route");if(r){let t=`${b} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t),i&&i!==e&&(i.setAttribute("http.route",r),i.updateName(t))}else e.updateName(`${b} ${O}`)}),o=async i=>{var n,o;let E=async({previousCacheEntry:a})=>{try{if(!j&&g&&M&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await s(i);e.fetchMetrics=Z.renderOpts.fetchMetrics;let o=Z.renderOpts.pendingWaitUntil;o&&r.waitUntil&&(r.waitUntil(o),o=void 0);let E=Z.renderOpts.collectedTags;if(!w)return await (0,p.sendResponse)(k,J,n,Z.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,R.toNodeOutgoingHttpHeaders)(n.headers);E&&(t[c.NEXT_CACHE_TAGS_HEADER]=E),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==Z.renderOpts.collectedRevalidate&&!(Z.renderOpts.collectedRevalidate>=c.INFINITE_CACHE)&&Z.renderOpts.collectedRevalidate,r=void 0===Z.renderOpts.collectedExpire||Z.renderOpts.collectedExpire>=c.INFINITE_CACHE?void 0:Z.renderOpts.collectedExpire;return{value:{kind:N.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==a?void 0:a.isStale)&&await C.onRequestError(e,t,{routerKind:"App Router",routePath:O,routeType:"route",revalidateReason:(0,A.getRevalidateReason)({isStaticGeneration:Y,isOnDemandRevalidate:g})},!1,f),t}},l=await C.handleResponse({req:e,nextConfig:h,cacheKey:G,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:g,revalidateOnlyGenerated:M,responseGenerator:E,waitUntil:r.waitUntil,isMinimalMode:j});if(!w)return null;if((null==l||null==(n=l.value)?void 0:n.kind)!==N.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(o=l.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});j||t.setHeader("x-nextjs-cache",g?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),m&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,R.fromNodeOutgoingHttpHeaders)(l.value.headers);return j&&w||u.delete(c.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,I.getCacheControlHeader)(l.cacheControl)),await (0,p.sendResponse)(k,J,new Response(l.value.body,{headers:u,status:l.value.status||200})),null};V&&B?await o(B):(i=q.getActiveScopeSpan(),await q.withPropagatedContext(e.headers,()=>q.trace(u.BaseServerSpan.handleRequest,{spanName:`${b} ${O}`,kind:n.SpanKind.SERVER,attributes:{"http.method":b,"http.target":e.url}},o),void 0,!V))}catch(t){if(t instanceof d.NoFallbackError||await C.onRequestError(e,t,{routerKind:"App Router",routePath:U,routeType:"route",revalidateReason:(0,A.getRevalidateReason)({isStaticGeneration:Y,isOnDemandRevalidate:g})},!1,f),w)throw t;return await (0,p.sendResponse)(k,J,new Response(null,{status:500})),null}}e.s(["handler",0,y,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:h,workUnitAsyncStorage:P})},"routeModule",0,C,"serverHooks",0,m,"workAsyncStorage",0,h,"workUnitAsyncStorage",0,P],25586)}];

//# sourceMappingURL=_0vg6haz._.js.map