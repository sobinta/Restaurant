import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, RefreshCw, ShieldCheck, UserPlus, Users } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { requireSupabase } from '../../lib/supabase';
import StaffInvitationForm from '../../components/staff/StaffInvitationForm';
import MemberRoleEditor from '../../components/staff/MemberRoleEditor';
import AuditTimeline from '../../components/staff/AuditTimeline';

const copy = {
  de:{title:'Teamzugänge',lead:'Rollen, Einladungen und Zugriff für diese Filiale.',members:'Team',invite:'Mitarbeiter einladen',audit:'Sicherheitsverlauf',email:'E-Mail-Adresse',roles:'Rollen',waiter:'Service',kitchen:'Küche',cashier:'Kasse',delivery:'Auslieferung',manager:'Management',sending:'Wird gesendet…',invitationSent:'Einladung wurde sicher versendet.',roleRequired:'Mindestens eine Rolle auswählen.',actionFailed:'Die Aktion konnte nicht abgeschlossen werden.',saveRoles:'Rollen speichern',suspend:'Sperren',activate:'Aktivieren',active:'Aktiv',suspended:'Gesperrt',revoked:'Widerrufen',empty:'Keine Einträge vorhanden.',back:'Arbeitsbereich',refresh:'Aktualisieren'},
  en:{title:'Team access',lead:'Roles, invitations and access for this branch.',members:'Team',invite:'Invite staff member',audit:'Security activity',email:'Email address',roles:'Roles',waiter:'Service',kitchen:'Kitchen',cashier:'Cashier',delivery:'Delivery',manager:'Management',sending:'Sending…',invitationSent:'The invitation was sent securely.',roleRequired:'Choose at least one role.',actionFailed:'The action could not be completed.',saveRoles:'Save roles',suspend:'Suspend',activate:'Activate',active:'Active',suspended:'Suspended',revoked:'Revoked',empty:'No activity yet.',back:'Workspace',refresh:'Refresh'},
  fa:{title:'دسترسی تیم',lead:'نقش‌ها، دعوت‌ها و دسترسی کارکنان این شعبه.',members:'اعضای تیم',invite:'دعوت کارمند',audit:'رویدادهای امنیتی',email:'آدرس ایمیل',roles:'نقش‌ها',waiter:'سالن',kitchen:'آشپزخانه',cashier:'صندوق',delivery:'ارسال',manager:'مدیریت',sending:'در حال ارسال…',invitationSent:'دعوت‌نامه به‌صورت امن ارسال شد.',roleRequired:'حداقل یک نقش انتخاب کنید.',actionFailed:'انجام عملیات ممکن نبود.',saveRoles:'ذخیره نقش‌ها',suspend:'تعلیق',activate:'فعال‌سازی',active:'فعال',suspended:'تعلیق‌شده',revoked:'لغوشده',empty:'هنوز رویدادی وجود ندارد.',back:'فضای کاری',refresh:'به‌روزرسانی'},
  ar:{title:'وصول الفريق',lead:'الأدوار والدعوات وصلاحيات هذا الفرع.',members:'الفريق',invite:'دعوة موظف',audit:'النشاط الأمني',email:'البريد الإلكتروني',roles:'الأدوار',waiter:'الصالة',kitchen:'المطبخ',cashier:'الصندوق',delivery:'التوصيل',manager:'الإدارة',sending:'جارٍ الإرسال…',invitationSent:'تم إرسال الدعوة بأمان.',roleRequired:'اختر دوراً واحداً على الأقل.',actionFailed:'تعذر إكمال العملية.',saveRoles:'حفظ الأدوار',suspend:'تعليق',activate:'تفعيل',active:'نشط',suspended:'معلّق',revoked:'ملغى',empty:'لا يوجد نشاط بعد.',back:'مساحة العمل',refresh:'تحديث'},
};

export default function StaffAccessPage() {
  const { branchId } = useParams(); const { lang } = useTheme(); const labels = copy[lang] || copy.en;
  const auth = useAuth(); const canManageManager = auth.globalRoles.includes('superadmin');
  const [state, setState] = useState({ loading:true, members:[], audit:[], error:'' });
  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading:true, error:'' }));
    try {
      const client = requireSupabase();
      const [membersResult, auditResult] = await Promise.all([
        client.from('branch_memberships').select('id,user_id,status,created_at,branch_membership_roles(role_key)').eq('branch_id', branchId).order('created_at'),
        client.from('audit_logs').select('id,action,target_type,target_id,created_at').eq('branch_id', branchId).order('created_at',{ascending:false}).limit(30),
      ]);
      if (membersResult.error) throw membersResult.error; if (auditResult.error) throw auditResult.error;
      const userIds = (membersResult.data || []).map((item) => item.user_id);
      const profiles = userIds.length ? await client.from('profiles').select('id,email,display_name').in('id', userIds) : { data:[], error:null };
      if (profiles.error) throw profiles.error;
      const profileMap = new Map((profiles.data || []).map((profile) => [profile.id, profile]));
      setState({ loading:false,error:'',audit:auditResult.data || [],members:(membersResult.data || []).map((member) => ({ ...member,name:profileMap.get(member.user_id)?.display_name || member.user_id.slice(0,8),email:profileMap.get(member.user_id)?.email || '—',roles:member.branch_membership_roles.map((item) => item.role_key) }))});
    } catch { setState((current) => ({ ...current, loading:false,error:labels.actionFailed })); }
  }, [branchId, labels.actionFailed]);
  useEffect(() => { void load(); }, [load]);
  return <main className="staff-access-page"><header className="staff-access-head page-width"><Link to={`/workspace/${branchId}/owner`}><ArrowLeft />{labels.back}</Link><span className="eyebrow">RBAC · BRANCH SECURITY</span><h1>{labels.title}</h1><p>{labels.lead}</p><button onClick={load}><RefreshCw />{labels.refresh}</button></header><section className="staff-access-grid page-width">
    <div className="staff-members-panel"><div className="staff-section-title"><Users /><h2>{labels.members}</h2><span>{state.members.length}</span></div>{state.error && <p className="form-error">{state.error}</p>}{state.loading ? <div className="staff-loading">Loading secure team…</div> : state.members.map((member) => <MemberRoleEditor key={member.id} member={member} canManageManager={canManageManager} labels={labels} onChanged={load} />)}</div>
    <aside><section className="staff-invite-panel"><div className="staff-section-title"><UserPlus /><h2>{labels.invite}</h2></div><StaffInvitationForm branchId={branchId} canInviteManager={canManageManager} labels={labels} onCreated={load} /></section><section className="staff-audit-panel"><div className="staff-section-title"><ShieldCheck /><h2>{labels.audit}</h2></div><AuditTimeline events={state.audit} emptyLabel={labels.empty} /></section></aside>
  </section></main>;
}
