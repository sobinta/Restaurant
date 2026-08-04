import React, { useEffect, useState } from 'react';
import { CheckCircle2, LoaderCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { acceptStaffInvitation } from '../../api/staffAccess';
import { useAuth } from '../../auth/useAuth';
import { useTheme } from '../../context/ThemeContext';
import AuthShell from './AuthShell';

const copy = {
  de:{title:'Teameinladung',lead:'Identität und Einladung werden sicher geprüft.',invalid:'Die Einladung ist ungültig, abgelaufen oder gehört zu einer anderen E-Mail-Adresse.',verifying:'Einladung wird geprüft…',ready:'Ihr Zugang ist bereit.',open:'Arbeitsbereiche öffnen',back:'Zum Konto'},
  en:{title:'Team invitation',lead:'Your identity and invitation are being verified securely.',invalid:'The invitation is invalid, expired, or belongs to another email.',verifying:'Verifying invitation…',ready:'Your access is ready.',open:'Open workspaces',back:'Back to account'},
  fa:{title:'دعوت تیم',lead:'هویت و دعوت‌نامه شما به‌صورت امن بررسی می‌شود.',invalid:'دعوت‌نامه نامعتبر یا منقضی است یا برای ایمیل دیگری صادر شده است.',verifying:'در حال بررسی دعوت‌نامه…',ready:'دسترسی شما آماده است.',open:'باز کردن فضاهای کاری',back:'بازگشت به حساب'},
  ar:{title:'دعوة الفريق',lead:'يتم التحقق من هويتك والدعوة بأمان.',invalid:'الدعوة غير صالحة أو منتهية أو تخص بريداً آخر.',verifying:'جارٍ التحقق من الدعوة…',ready:'وصولك جاهز.',open:'فتح مساحات العمل',back:'العودة للحساب'},
};

export default function AcceptInvitationPage() {
  const [params] = useSearchParams(); const navigate = useNavigate(); const { refreshAccess } = useAuth();
  const { lang } = useTheme(); const labels = copy[lang] || copy.en;
  const token = params.get('token');
  const [state, setState] = useState({ status:'loading', error:'' });
  useEffect(() => {
    if (!token) return setState({ status:'error', error:labels.invalid });
    let active = true;
    acceptStaffInvitation(token).then(async () => { await refreshAccess(); if (active) setState({status:'success',error:''}); }).catch(() => { if (active) setState({status:'error',error:labels.invalid}); });
    return () => { active = false; };
  }, [labels.invalid, refreshAccess, token]);
  return <AuthShell title={labels.title} lead={labels.lead}><div className="invitation-result">{state.status === 'loading' && <><LoaderCircle className="spin" /><p>{labels.verifying}</p></>}{state.status === 'success' && <><CheckCircle2 /><p>{labels.ready}</p><button className="button button-primary" onClick={() => navigate('/workspaces',{replace:true})}>{labels.open}</button></>}{state.status === 'error' && <><p className="form-error">{state.error}</p><button className="button button-ghost" onClick={() => navigate('/account',{replace:true})}>{labels.back}</button></>}</div></AuthShell>;
}
