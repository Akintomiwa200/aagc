/**
 * services/paymentService.ts
 *
 * Expo-managed compatible payment flows:
 *  ✅ Paystack  — via expo-web-browser (no native SDK needed)
 *  ✅ Nigerian bank apps — Linking.openURL deep link → app opens
 *  ✅ USSD     — tel: scheme via Linking (dials code on device)
 *  ✅ Bank Transfer — account details shown in-app (copy to clipboard)
 *  ✅ International apps — Revolut, Monzo, Wise, PayPal, CashApp, Zelle
 *
 * Install:  expo install expo-web-browser expo-linking
 *           (both are already available in Expo managed — just import)
 */

import { Linking, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { toast } from 'sonner-native';

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — replace these with your real values before going live
// ─────────────────────────────────────────────────────────────────────────────
export const PAYSTACK_PUBLIC_KEY = 'pk_test_REPLACE_WITH_YOUR_KEY'; // from dashboard.paystack.com

/**
 * Your church bank accounts.
 * Add/edit these once you have the real details.
 * Each key is a currency ID; DEFAULT catches everything else.
 */
export const CHURCH_ACCOUNTS: Record<string, Record<string, string>> = {
  NGN: {
    Bank:           'Access Bank',
    'Account Name': 'Grace Community Church',
    'Account No':   '0123456789',
    'Sort Code':    '044',
  },
  USD: {
    Bank:           'Citibank N.A.',
    'Account Name': 'Grace Community Church',
    'Account No':   '9876543210',
    'Routing No':   '021000089',
    SWIFT:          'CITIUS33',
    IBAN:           'US12 CITI 0210 0001 2345 6789',
  },
  GBP: {
    Bank:           'Barclays Bank',
    'Account Name': 'Grace Community Church',
    'Account No':   '12345678',
    'Sort Code':    '20-00-00',
    IBAN:           'GB29 BARC 2000 0012 3456 78',
    SWIFT:          'BARCGB22',
  },
  EUR: {
    Bank:           'Deutsche Bank',
    'Account Name': 'Grace Community Church',
    IBAN:           'DE89 3704 0044 0532 0130 00',
    SWIFT:          'DEUTDEDB',
  },
  DEFAULT: {
    'Transfer via': 'Wise (TransferWise)',
    'Account Name': 'Grace Community Church',
    Email:          'giving@gracechurch.org',
    Note:           'Use Wise for any currency. Fees are lowest with Wise.',
  },
};

/** USSD codes — shown as fallback when bank app is not installed */
export const USSD: Record<string, string> = {
  opay:      '*955#',
  palmpay:   '*861#',
  kuda:      '*7342#',
  access:    '*901#',
  gtb:       '*737#',
  zenith:    '*966#',
  firstbank: '*894#',
};

/** App Store / Play Store URLs per bank app */
const STORE: Record<string, { ios: string; android: string }> = {
  opay:      { ios: 'https://apps.apple.com/ng/app/opay/id1498747662',       android: 'https://play.google.com/store/apps/details?id=team.opay.pay' },
  palmpay:   { ios: 'https://apps.apple.com/ng/app/palmpay/id1578900063',    android: 'https://play.google.com/store/apps/details?id=com.palmpay.merchant' },
  kuda:      { ios: 'https://apps.apple.com/ng/app/kuda-bank/id1473959859',  android: 'https://play.google.com/store/apps/details?id=com.kudabank.app' },
  access:    { ios: 'https://apps.apple.com/ng/app/accessmore/id1542980560', android: 'https://play.google.com/store/apps/details?id=com.accessbank.accessmore' },
  gtb:       { ios: 'https://apps.apple.com/ng/app/gtbank/id396795518',      android: 'https://play.google.com/store/apps/details?id=com.gtbank.mobile' },
  zenith:    { ios: 'https://apps.apple.com/ng/app/zenith-bank/id493028461', android: 'https://play.google.com/store/apps/details?id=com.zenithebank' },
  firstbank: { ios: 'https://apps.apple.com/ng/app/firstmobile/id516731935', android: 'https://play.google.com/store/apps/details?id=com.firstbank.firstmobile2' },
};

// ─────────────────────────────────────────────────────────────────────────────
// PAYSTACK  (Expo WebBrowser — zero native install required)
// ─────────────────────────────────────────────────────────────────────────────

export interface PaystackOptions {
  email:     string;
  amount:    number;       // in kobo for NGN, cents for USD etc.
  currency:  string;       // 'NGN' | 'USD' | 'GBP' | 'GHS' | 'ZAR' | 'KES'
  reference: string;
  metadata?: Record<string, any>;
  channels?: string[];     // ['card', 'bank', 'ussd', 'mobile_money']
}

/**
 * Open Paystack inline checkout in a WebView-style browser.
 * Returns 'success' | 'cancelled' | 'error'.
 *
 * After a successful payment Paystack redirects to your callback_url.
 * Set EXPO_PUBLIC_APP_SCHEME in your .env (e.g. "gracechurch") so the
 * redirect comes back to your app.
 */
export async function openPaystackCheckout(opts: PaystackOptions): Promise<'success' | 'cancelled' | 'error'> {
  const callbackUrl = `${process.env.EXPO_PUBLIC_APP_SCHEME ?? 'gracechurch'}://giving/callback`;

  // Build the Paystack inline checkout URL
  // We use Paystack's hosted payment page — no native SDK needed at all
  const params = new URLSearchParams({
    key:          PAYSTACK_PUBLIC_KEY,
    email:        opts.email,
    amount:       String(opts.amount * 100),      // Paystack expects amount in lowest unit
    currency:     opts.currency,
    ref:          opts.reference,
    callback_url: callbackUrl,
    channels:     (opts.channels ?? ['card', 'bank', 'ussd', 'mobile_money']).join(','),
    metadata:     JSON.stringify(opts.metadata ?? {}),
  });

  const checkoutUrl = `https://checkout.paystack.com/pay?${params.toString()}`;

  try {
    const result = await WebBrowser.openAuthSessionAsync(checkoutUrl, callbackUrl, {
      showTitle:              true,
      toolbarColor:           '#00B140',
      enableDefaultShareMenuItem: false,
    });

    if (result.type === 'success') {
      // URL contains ?trxref=...&reference=...
      const url = result.url ?? '';
      if (url.includes('trxref') || url.includes('reference')) return 'success';
    }
    if (result.type === 'cancel' || result.type === 'dismiss') return 'cancelled';
    return 'error';
  } catch {
    return 'error';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// NIGERIAN BANK APPS  — deep link → open app, fallback to store or USSD alert
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Attempt to open a Nigerian banking app.
 * Returns true if the app opened, false if it fell back to the store/USSD.
 *
 * Since we don't have merchant deep-link credentials yet, we open the app's
 * home screen. The user then manually sends to the church account shown in
 * the BankTransferModal that the caller should display.
 */
export async function openNigerianBankApp(bankId: string): Promise<boolean> {
  const deepLinks: Record<string, string> = {
    opay:      'opay://',
    palmpay:   'palmpay://',
    kuda:      'kudabank://',
    access:    'accessmore://',
    gtb:       'gtbank://',
    zenith:    'zenithbank://',
    firstbank: 'firstbank://',
  };

  const url = deepLinks[bankId];
  if (!url) return false;

  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
      return true;
    }
  } catch { /**/ }

  // App not installed — offer store or USSD
  const storeUrl = Platform.OS === 'ios' ? STORE[bankId]?.ios : STORE[bankId]?.android;
  const ussd     = USSD[bankId];

  toast.warning('App Not Installed', {
    description: `${bankId.charAt(0).toUpperCase() + bankId.slice(1)} app is not installed on this device.`,
    action: storeUrl ? { label: 'Download App', onClick: () => Linking.openURL(storeUrl) } : undefined,
    cancel: ussd ? { label: `Dial ${ussd}`, onClick: () => dialUSSD(ussd) } : undefined,
    duration: 7000,
  });
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// USSD DIALER
// ─────────────────────────────────────────────────────────────────────────────

export async function dialUSSD(code: string): Promise<void> {
  // Encode * and # for tel: scheme
  const telUrl = `tel:${encodeURIComponent(code)}`;
  try {
    const can = await Linking.canOpenURL(telUrl);
    if (can) { await Linking.openURL(telUrl); return; }
  } catch { /**/ }
  toast('Dial Manually', { description: `Please dial ${code} on your phone keypad to complete the transfer.` });
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERNATIONAL PAYMENT APPS  (all via Linking — works in Expo managed)
// ─────────────────────────────────────────────────────────────────────────────

async function tryLink(appUrl: string, webUrl: string) {
  try {
    const can = await Linking.canOpenURL(appUrl);
    await Linking.openURL(can ? appUrl : webUrl);
  } catch {
    await Linking.openURL(webUrl).catch(() => {});
  }
}

export async function openRevolut(amount: number, currency: string, reference: string) {
  // Revolut payment request deep link
  await tryLink(
    `revolut://payment?amount=${amount}&currency=${currency}&reference=${encodeURIComponent(reference)}`,
    `https://revolut.me/gracechurch`, // replace with your Revolut.me link
  );
}

export async function openMonzo(amount: number, reference: string) {
  // Monzo.me payment link — replace 'gracechurchuk' with your username
  const monzoUrl = `https://monzo.me/gracechurchuk/${amount}?d=${encodeURIComponent(reference)}`;
  await tryLink(`monzo://`, monzoUrl);
}

export async function openWise(amount: number, currency: string, reference: string) {
  // Wise payment link — replace with your real Wise paylink
  const wiseUrl = `https://wise.com/pay/me/gracechurch?amount=${amount}&currency=${currency}&reference=${encodeURIComponent(reference)}`;
  await tryLink(`wise://`, wiseUrl);
}

export async function openPayPal(amount: number, currency: string) {
  // PayPal.me — replace 'GraceChurchGiving' with your PayPal.me username
  const paypalUrl = `https://paypal.me/GraceChurchGiving/${amount}${currency}`;
  await tryLink(`paypal://`, paypalUrl);
}

export async function openCashApp(amount: number, note: string) {
  // Cash App $cashtag — replace '$GraceChurch' with your cashtag
  await tryLink(
    `cashapp://pay/$GraceChurch?amount=${amount}&note=${encodeURIComponent(note)}`,
    `https://cash.app/$GraceChurch/${amount}`,
  );
}

export async function openZelle(amount: number) {
  // Zelle has no public deep-link API — show details in alert
  toast('Send via Zelle', {
    description: `Send $${amount.toLocaleString()} to: giving@gracechurch.org | +1 (555) 000-0000 | Memo: Church Giving`,
    action: { label: 'Open Zelle App', onClick: () => tryLink('zelle://', 'https://www.zellepay.com') },
    duration: 8000,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// BANK TRANSFER DETAILS
// ─────────────────────────────────────────────────────────────────────────────

export function getTransferDetails(currency: string): Record<string, string> {
  return CHURCH_ACCOUNTS[currency] ?? CHURCH_ACCOUNTS.DEFAULT;
}
