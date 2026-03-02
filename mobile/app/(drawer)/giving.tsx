/**
 * screens/GivingScreen.tsx
 *
 * Expo managed workflow — zero native modules.
 * Dependencies (all Expo-safe):
 *   expo install expo-web-browser expo-clipboard
 *   (expo-linking is already built-in)
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  ActivityIndicator, Alert, StyleSheet, Modal,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { ArrowLeft, Copy, Check, X } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { apiService } from '@/services/apiService';
import { useSocket } from '@/context/SocketContext';
import {
  PAYSTACK_PUBLIC_KEY,
  USSD,
  openPaystackCheckout,
  openNigerianBankApp,
  dialUSSD,
  openRevolut,
  openMonzo,
  openWise,
  openPayPal,
  openCashApp,
  openZelle,
  getTransferDetails,
} from '@/services/paymentService';

// ─── NAV SCREENS ──────────────────────────────────────────────────────────────
const SCREEN = {
  TYPE:     'type',
  CURRENCY: 'currency',
  AMOUNT:   'amount',
  PAYMENT:  'payment',
  SUCCESS:  'success',
} as const;
type Screen = typeof SCREEN[keyof typeof SCREEN];

// ─── STATIC DATA ──────────────────────────────────────────────────────────────
const GIVING_TYPES = [
  { id: 'tithe',      label: 'Tithe',         icon: '🙏', desc: '10% of your income'     },
  { id: 'offering',   label: 'Offering',       icon: '🕊️', desc: 'Freewill giving'         },
  { id: 'firstfruit', label: 'First Fruit',    icon: '🌾', desc: 'First of your increase'  },
  { id: 'project',    label: 'Church Project', icon: '⛪', desc: 'Building & development'  },
  { id: 'welfare',    label: 'Welfare',        icon: '❤️', desc: 'Support members in need' },
  { id: 'missions',   label: 'Missions',       icon: '🌍', desc: 'Spread the gospel'       },
];

const CURRENCIES = [
  { id: 'NGN', symbol: '₦',   label: 'Nigerian Naira',     flag: '🇳🇬', psCode: 'NGN' },
  { id: 'USD', symbol: '$',   label: 'US Dollar',          flag: '🇺🇸', psCode: 'USD' },
  { id: 'GBP', symbol: '£',   label: 'British Pounds',     flag: '🇬🇧', psCode: 'GBP' },
  { id: 'EUR', symbol: '€',   label: 'Euro',               flag: '🇪🇺', psCode: 'EUR' },
  { id: 'CAD', symbol: 'CA$', label: 'Canadian Dollar',    flag: '🇨🇦', psCode: 'CAD' },
  { id: 'GHS', symbol: '₵',   label: 'Ghanaian Cedis',     flag: '🇬🇭', psCode: 'GHS' },
  { id: 'KES', symbol: 'KSh', label: 'Kenyan Shilling',    flag: '🇰🇪', psCode: 'KES' },
  { id: 'ZAR', symbol: 'R',   label: 'South African Rand', flag: '🇿🇦', psCode: 'ZAR' },
];

const QUICK_AMOUNTS: Record<string, number[]> = {
  NGN: [1000, 2000, 5000, 10000, 20000, 50000],
  USD: [5, 10, 25, 50, 100, 250],
  GBP: [5, 10, 20, 50, 100, 200],
  EUR: [5, 10, 20, 50, 100, 200],
  CAD: [5, 10, 25, 50, 100, 250],
  GHS: [20, 50, 100, 200, 500, 1000],
  KES: [500, 1000, 2000, 5000, 10000, 20000],
  ZAR: [50, 100, 200, 500, 1000, 2000],
};

/**
 * action values drive exactly what happens when "Give Now" is pressed:
 *   paystack_card   → Paystack WebBrowser checkout
 *   deeplink_<id>   → open Nigerian bank app + show transfer modal
 *   bank_transfer   → show transfer modal only
 *   revolut/monzo/wise/paypal/cashapp/zelle → international deep link
 */
const PAYMENT_METHODS: Record<string, any[]> = {
  NGN: [
    { id: 'opay',      label: 'OPay',         icon: 'O',  bg: '#00B140', fg: '#fff',    desc: 'Opens OPay app · transfer to church account',     action: 'deeplink_opay',      ussd: '*955#' },
    { id: 'palmpay',   label: 'PalmPay',      icon: 'P',  bg: '#FF6B00', fg: '#fff',    desc: 'Opens PalmPay · transfer to church account',      action: 'deeplink_palmpay',   ussd: '*861#' },
    { id: 'kuda',      label: 'Kuda',         icon: 'K',  bg: '#5D34F2', fg: '#fff',    desc: 'Opens Kuda · transfer to church account',         action: 'deeplink_kuda',      ussd: '*7342#' },
    { id: 'access',    label: 'Access Bank',  icon: 'A',  bg: '#E30613', fg: '#fff',    desc: 'Opens AccessMore · transfer to church account',   action: 'deeplink_access',    ussd: '*901#' },
    { id: 'gtb',       label: 'GTBank',       icon: 'GT', bg: '#F07924', fg: '#fff',    desc: 'Opens GTBank app · transfer to church account',   action: 'deeplink_gtb',       ussd: '*737#' },
    { id: 'zenith',    label: 'Zenith Bank',  icon: 'Z',  bg: '#8B0000', fg: '#fff',    desc: 'Opens Zenith app · transfer to church account',   action: 'deeplink_zenith',    ussd: '*966#' },
    { id: 'firstbank', label: 'First Bank',   icon: 'FB', bg: '#003882', fg: '#fff',    desc: 'Opens FirstMobile · transfer to church account',  action: 'deeplink_firstbank', ussd: '*894#' },
    { id: 'transfer',  label: 'Bank Transfer',icon: '↗',  bg: '#374151', fg: '#fff',    desc: 'View account details · transfer from any bank',   action: 'bank_transfer',      ussd: null },
    { id: 'card',      label: 'Debit Card',   icon: '💳', bg: '#F3F4F6', fg: '#374151', desc: 'Visa / Mastercard · secured by Paystack',         action: 'paystack_card',      ussd: null },
  ],
  USD: [
    { id: 'card',     label: 'Debit/Credit Card', icon: '💳', bg: '#F3F4F6', fg: '#374151', desc: 'Visa / Mastercard · secured by Paystack', action: 'paystack_card' },
    { id: 'paypal',   label: 'PayPal',            icon: 'PP', bg: '#003087', fg: '#fff',    desc: 'Opens PayPal app or browser',             action: 'paypal'        },
    { id: 'cashapp',  label: 'Cash App',          icon: 'CA', bg: '#00D632', fg: '#fff',    desc: 'Opens Cash App directly',                 action: 'cashapp'       },
    { id: 'zelle',    label: 'Zelle',             icon: 'Z',  bg: '#6B2FAE', fg: '#fff',    desc: 'Shows Zelle payment details',             action: 'zelle'         },
    { id: 'wise',     label: 'Wise',              icon: 'W',  bg: '#9FE870', fg: '#333',    desc: 'Opens Wise app or browser',               action: 'wise'          },
    { id: 'transfer', label: 'Wire Transfer',     icon: '↗',  bg: '#374151', fg: '#fff',    desc: 'US bank wire details',                    action: 'bank_transfer' },
  ],
  GBP: [
    { id: 'card',     label: 'Debit/Credit Card', icon: '💳', bg: '#F3F4F6', fg: '#374151', desc: 'Visa / Mastercard · secured by Paystack', action: 'paystack_card' },
    { id: 'revolut',  label: 'Revolut',           icon: 'R',  bg: '#0075EB', fg: '#fff',    desc: 'Opens Revolut app directly',              action: 'revolut'       },
    { id: 'monzo',    label: 'Monzo',             icon: 'M',  bg: '#FF3464', fg: '#fff',    desc: 'Opens Monzo payment link',                action: 'monzo'         },
    { id: 'wise',     label: 'Wise',              icon: 'W',  bg: '#9FE870', fg: '#333',    desc: 'Opens Wise app or browser',               action: 'wise'          },
    { id: 'transfer', label: 'Bank Transfer',     icon: '↗',  bg: '#374151', fg: '#fff',    desc: 'UK sort code & account details',          action: 'bank_transfer' },
  ],
  DEFAULT: [
    { id: 'card',     label: 'Debit/Credit Card', icon: '💳', bg: '#F3F4F6', fg: '#374151', desc: 'Visa / Mastercard · secured by Paystack', action: 'paystack_card' },
    { id: 'paypal',   label: 'PayPal',            icon: 'PP', bg: '#003087', fg: '#fff',    desc: 'Opens PayPal app or browser',             action: 'paypal'        },
    { id: 'wise',     label: 'Wise',              icon: 'W',  bg: '#9FE870', fg: '#333',    desc: 'International money transfer',            action: 'wise'          },
    { id: 'transfer', label: 'Wire Transfer',     icon: '↗',  bg: '#374151', fg: '#fff',    desc: 'International wire details',              action: 'bank_transfer' },
  ],
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const genRef = () => `GVC-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

const fmtAmt = (amount: number, currencyId: string) => {
  const c = CURRENCIES.find(x => x.id === currencyId);
  return `${c?.symbol ?? ''}${amount.toLocaleString()}`;
};

const humanKey = (k: string) =>
  k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());

// ─── BANK TRANSFER BOTTOM SHEET ───────────────────────────────────────────────
interface TransferModalProps {
  visible:   boolean;
  onClose:   () => void;
  currency:  string;
  amount:    number;
  reference: string;
  bankId?:   string;   // if set, also shows USSD option
}

function BankTransferModal({ visible, onClose, currency, amount, reference, bankId }: TransferModalProps) {
  const { colors } = useTheme();
  const details  = getTransferDetails(currency);
  const entries  = Object.entries(details);
  const currSym  = CURRENCIES.find(c => c.id === currency)?.symbol ?? '';
  const ussdCode = bankId ? USSD[bankId] : null;

  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (val: string, key: string) => {
    await Clipboard.setStringAsync(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const s = StyleSheet.create({
    overlay:  { flex: 1, backgroundColor: '#00000070', justifyContent: 'flex-end' },
    sheet:    { backgroundColor: colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 44 },
    header:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    title:    { fontSize: 18, fontWeight: '800', color: colors.text },
    amtBox:   { backgroundColor: colors.primary + '18', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: colors.primary + '33' },
    amtVal:   { fontSize: 28, fontWeight: '800', color: colors.primary },
    amtLbl:   { fontSize: 12, color: colors.secondary, marginTop: 2 },
    row:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border },
    rowLast:  { flexDirection: 'row', alignItems: 'center', paddingVertical: 13 },
    fKey:     { fontSize: 13, color: colors.secondary, flex: 1 },
    fVal:     { fontSize: 14, fontWeight: '700', color: colors.text, flex: 2, textAlign: 'right', marginRight: 8 },
    copyBtn:  { padding: 6 },
    ussdBox:  { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary + '12', borderRadius: 12, padding: 14, marginTop: 14, gap: 12 },
    ussdTxt:  { flex: 1, fontSize: 13, color: colors.text, fontWeight: '600' },
    ussdBtn:  { backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7 },
    ussdBtnT: { color: '#fff', fontSize: 13, fontWeight: '700' },
    doneBtn:  { backgroundColor: colors.primary, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 20 },
    doneTxt:  { color: '#fff', fontWeight: '800', fontSize: 15 },
    note:     { fontSize: 12, color: colors.secondary, fontStyle: 'italic', marginTop: 12, lineHeight: 17 },
  });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>

          {/* Header */}
          <View style={s.header}>
            <Text style={s.title}>Transfer Details</Text>
            <TouchableOpacity onPress={onClose}><X size={22} color={colors.secondary} /></TouchableOpacity>
          </View>

          {/* Amount to send */}
          <View style={s.amtBox}>
            <Text style={s.amtVal}>{currSym}{amount?.toLocaleString()}</Text>
            <Text style={s.amtLbl}>Amount to Send</Text>
          </View>

          {/* Account detail fields */}
          {entries.map(([key, val], i) => (
            <View key={key} style={i < entries.length - 1 ? s.row : s.rowLast}>
              <Text style={s.fKey}>{humanKey(key)}</Text>
              <Text style={s.fVal}>{val}</Text>
              <TouchableOpacity style={s.copyBtn} onPress={() => copy(val, key)}>
                {copied === key
                  ? <Check size={16} color={colors.primary} />
                  : <Copy size={16} color={colors.secondary} />}
              </TouchableOpacity>
            </View>
          ))}

          {/* Reference row */}
          <View style={s.row}>
            <Text style={s.fKey}>Narration / Ref</Text>
            <Text style={s.fVal}>{reference}</Text>
            <TouchableOpacity style={s.copyBtn} onPress={() => copy(reference, 'ref')}>
              {copied === 'ref'
                ? <Check size={16} color={colors.primary} />
                : <Copy size={16} color={colors.secondary} />}
            </TouchableOpacity>
          </View>

          {/* USSD fallback button */}
          {ussdCode && (
            <View style={s.ussdBox}>
              <Text style={s.ussdTxt}>
                No internet? Dial {ussdCode} to transfer ₦{amount?.toLocaleString()}
              </Text>
              <TouchableOpacity style={s.ussdBtn} onPress={() => dialUSSD(ussdCode)}>
                <Text style={s.ussdBtnT}>Dial</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={s.note}>
            ℹ️ Use your bank app to transfer the exact amount above to this account. Include the reference number as narration so we can identify your giving.
          </Text>

          <TouchableOpacity style={s.doneBtn} onPress={onClose}>
            <Text style={s.doneTxt}>Done — I've Made the Transfer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function GivingScreen() {
  const { colors } = useTheme();

  const [screen, setScreen]               = useState<Screen>(SCREEN.TYPE);
  const [givingType, setGivingType]       = useState<string | null>(null);
  const [currency, setCurrency]           = useState<string | null>(null);
  const [selectedAmt, setSelectedAmt]     = useState<number | null>(null);
  const [customAmt, setCustomAmt]         = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [processing, setProcessing]       = useState(false);
  const [history, setHistory]             = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [user, setUser]                   = useState<any>(null);
  const [transferModal, setTransferModal] = useState<{ visible: boolean; bankId?: string }>({ visible: false });
  const txRef = useRef(genRef()).current;
  const { socket } = useSocket();

  // ── Fetch user + history ───────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const u = await apiService.getMe();
        setUser(u);
        if (u?.id || u?._id) {
          const d = await apiService.getDonations(u.id || u._id);
          setHistory(d);
        }
      } catch { /**/ } finally { setLoadingHistory(false); }
    })();
  }, []);

  useEffect(() => {
    if (!socket || !user) return;
    const uid = user.id || user._id;
    const h = (data: any) => { if (data.userId === uid) setHistory(p => [data, ...p]); };
    socket.on('donation-created', h);
    return () => {
      socket.off('donation-created', h);
    };
  }, [socket, user]);

  // ── Derived values ─────────────────────────────────────────────────────────
  const quickAmounts   = QUICK_AMOUNTS[currency ?? 'NGN'] ?? QUICK_AMOUNTS.NGN;
  const paymentMethods = PAYMENT_METHODS[currency ?? 'DEFAULT'] ?? PAYMENT_METHODS.DEFAULT;
  const finalAmount    = selectedAmt ?? (customAmt ? parseFloat(customAmt) : 0);
  const currencyObj    = CURRENCIES.find(c => c.id === currency);
  const givingObj      = GIVING_TYPES.find(g => g.id === givingType);
  const paymentObj     = paymentMethods.find(p => p.id === paymentMethod);
  const totalGiving    = history.reduce((s, i) => s + (i.amount ?? 0), 0);

  // ── Record donation on backend ─────────────────────────────────────────────
  const recordDonation = useCallback(async () => {
    if (!user) return;
    if (!givingType) return;
    try {
      await apiService.createDonation({
        type: givingType, amount: finalAmount,
        userId: user.id || user._id,
      });
      const d = await apiService.getDonations(user.id || user._id);
      setHistory(d);
    } catch { /**/ }
  }, [givingType, finalAmount, currency, paymentMethod, txRef, user]);

  // ── MAIN GIVE HANDLER ──────────────────────────────────────────────────────
  const handleGive = async () => {
    if (!user)           { Alert.alert('Sign In Required', 'Please sign in to give.'); return; }
    if (finalAmount <= 0){ Alert.alert('Invalid Amount', 'Please select or enter a valid amount.'); return; }

    const action    = paymentObj?.action ?? '';
    const bankId    = action.startsWith('deeplink_') ? action.replace('deeplink_', '') : undefined;
    const narration = `${givingObj?.label} - ${txRef}`;

    setProcessing(true);
    try {
      // ── Paystack card checkout (Expo WebBrowser) ──────────────────────────
      if (action === 'paystack_card') {
        const result = await openPaystackCheckout({
          email:    user.email ?? 'guest@gracechurch.org',
          amount:   finalAmount,
          currency: currencyObj?.psCode ?? 'NGN',
          reference: txRef,
          channels: currency === 'NGN'
            ? ['card', 'bank', 'ussd', 'mobile_money']
            : ['card'],
          metadata: {
            givingType,
            memberName: user.name ?? '',
            memberId:   user.id || user._id,
          },
        });

        if (result === 'success') {
          await recordDonation();
          setScreen(SCREEN.SUCCESS);
        } else if (result === 'cancelled') {
          Alert.alert('Cancelled', 'Payment was cancelled. You can try again anytime.');
        } else {
          Alert.alert('Payment Failed', 'Something went wrong. Please try again or choose another payment method.');
        }
        return;
      }

      // ── Nigerian bank app deep links ──────────────────────────────────────
      if (action.startsWith('deeplink_') && bankId) {
        await openNigerianBankApp(bankId);
        // Whether app opened or not, show the transfer details so the user
        // knows exactly which account to send to
        setTransferModal({ visible: true, bankId });
        return;
      }

      // ── Bank / wire transfer (no app launch) ─────────────────────────────
      if (action === 'bank_transfer') {
        setTransferModal({ visible: true });
        return;
      }

      // ── International apps ────────────────────────────────────────────────
      if (action === 'revolut') {
        await openRevolut(finalAmount, currency ?? 'GBP', txRef);
        confirmAfterExternalApp('Revolut');
        return;
      }
      if (action === 'monzo') {
        await openMonzo(finalAmount, txRef);
        confirmAfterExternalApp('Monzo');
        return;
      }
      if (action === 'wise') {
        await openWise(finalAmount, currency ?? 'GBP', txRef);
        confirmAfterExternalApp('Wise');
        return;
      }
      if (action === 'paypal') {
        await openPayPal(finalAmount, currency ?? 'USD');
        confirmAfterExternalApp('PayPal');
        return;
      }
      if (action === 'cashapp') {
        await openCashApp(finalAmount, narration);
        confirmAfterExternalApp('Cash App');
        return;
      }
      if (action === 'zelle') {
        await openZelle(finalAmount);
        return;
      }

      Alert.alert('Coming Soon', 'This payment method will be available soon.');

    } catch {
      Alert.alert('Error', 'Could not initiate payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  /** After user returns from an external app, confirm + record */
  const confirmAfterExternalApp = (appName: string) => {
    Alert.alert(
      `Complete in ${appName}`,
      `Once you finish the payment in ${appName}, tap "Done" below to confirm your giving.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Done — Payment Sent', onPress: async () => { await recordDonation(); setScreen(SCREEN.SUCCESS); } },
      ],
    );
  };

  const reset = () => {
    setScreen(SCREEN.TYPE);
    setGivingType(null); setCurrency(null);
    setSelectedAmt(null); setCustomAmt('');
    setPaymentMethod(null);
  };

  // ── STYLES (follow DevotionalScreen pattern — colors from context) ──────────
  const s = StyleSheet.create({
    container:    { flex: 1, backgroundColor: colors.background },
    content:      { padding: 16, paddingBottom: 100 },
    title:        { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
    subtitle:     { fontSize: 13, color: colors.primary, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 24 },
    sectionLabel: { fontSize: 13, fontWeight: '700', color: colors.primary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
    card:         { backgroundColor: colors.card, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3, marginBottom: 16 },
    row:          { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
    rowLast:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
    rowLabel:     { fontSize: 16, fontWeight: '600', color: colors.text },
    rowDesc:      { fontSize: 12, color: colors.secondary, marginTop: 1 },
    check:        { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' },
    uncheck:      { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, marginLeft: 'auto' },
    checkTxt:     { color: '#fff', fontSize: 12, fontWeight: '800' },
    radioOuter:   { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' },
    radioActive:  { borderColor: colors.primary },
    radioInner:   { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
    statsCard:    { backgroundColor: colors.primary, borderRadius: 20, padding: 22, alignItems: 'center', marginBottom: 24 },
    statsAmt:     { fontSize: 34, fontWeight: '800', color: '#fff', letterSpacing: -1 },
    statsLbl:     { fontSize: 13, color: '#ffffff99', marginTop: 2 },
    amtDisplay:   { backgroundColor: colors.card, borderRadius: 20, paddingVertical: 28, alignItems: 'center', borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
    amtSymbol:    { fontSize: 24, fontWeight: '700', color: colors.secondary },
    amtValue:     { fontSize: 52, fontWeight: '800', color: colors.text, letterSpacing: -2 },
    quickGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
    quickBtn:     { width: '30.5%', paddingVertical: 14, borderRadius: 14, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.card, alignItems: 'center' },
    quickActive:  { borderColor: colors.primary, backgroundColor: colors.primary + '15' },
    quickTxt:     { fontSize: 15, fontWeight: '700', color: colors.text },
    quickTxtAct:  { color: colors.primary },
    inputWrap:    { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 20 },
    inputSym:     { fontSize: 18, fontWeight: '700', color: colors.secondary, marginRight: 8 },
    input:        { flex: 1, fontSize: 18, fontWeight: '700', color: colors.text },
    payIconBox:   { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
    payIconTxt:   { fontSize: 13, fontWeight: '900' },
    summaryPill:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.primary + '12', borderRadius: 50, paddingHorizontal: 18, paddingVertical: 10, marginBottom: 16, borderWidth: 1, borderColor: colors.primary + '30' },
    summaryTxt:   { fontSize: 14, fontWeight: '600', color: colors.text },
    summaryAmt:   { fontSize: 14, fontWeight: '800', color: colors.primary },
    rcptRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
    rcptKey:      { fontSize: 14, color: colors.secondary },
    rcptVal:      { fontSize: 14, fontWeight: '700', color: colors.text },
    giveBtn:      { backgroundColor: colors.primary, borderRadius: 16, padding: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    giveTxt:      { color: '#fff', fontSize: 17, fontWeight: '800' },
    giveDis:      { opacity: 0.4 },
    backBtn:      { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, marginBottom: 20 },
    backTxt:      { fontSize: 15, fontWeight: '600', color: colors.primary },
    histRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
    histType:     { fontSize: 15, fontWeight: '700', color: colors.text, textTransform: 'capitalize' },
    histDate:     { fontSize: 12, color: colors.secondary, marginTop: 2 },
    histAmt:      { fontSize: 17, fontWeight: '800', color: '#10B981' },
    successWrap:  { alignItems: 'center', paddingVertical: 24 },
    successRing:  { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    successTitle: { fontSize: 28, fontWeight: '900', color: colors.text, marginBottom: 8 },
    successMsg:   { fontSize: 15, color: colors.secondary, textAlign: 'center', lineHeight: 22, marginBottom: 8, maxWidth: 280 },
    successVerse: { fontSize: 13, color: colors.primary, fontStyle: 'italic', fontWeight: '600', marginBottom: 24, textAlign: 'center' },
    trustNote:    { textAlign: 'center', fontSize: 12, color: colors.secondary, marginTop: 4 },
  });

  // ─── SCREEN: TYPE ──────────────────────────────────────────────────────────
  if (screen === SCREEN.TYPE) return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>Give</Text>
      <Text style={s.subtitle}>Support the Ministry</Text>

      {/* Stats */}
      <View style={s.statsCard}>
        <Text style={s.statsAmt}>₦{totalGiving.toLocaleString()}</Text>
        <Text style={s.statsLbl}>Total Giving</Text>
      </View>

      {/* Giving type list */}
      <Text style={s.sectionLabel}>What are you giving?</Text>
      <View style={s.card}>
        {GIVING_TYPES.map((t, i) => (
          <TouchableOpacity
            key={t.id}
            style={i === GIVING_TYPES.length - 1 ? s.rowLast : s.row}
            onPress={() => setGivingType(t.id)}
          >
            <Text style={{ fontSize: 22, marginRight: 12 }}>{t.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.rowLabel}>{t.label}</Text>
              <Text style={s.rowDesc}>{t.desc}</Text>
            </View>
            <View style={givingType === t.id ? s.check : s.uncheck}>
              {givingType === t.id && <Text style={s.checkTxt}>✓</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[s.giveBtn, !givingType && s.giveDis]}
        disabled={!givingType}
        onPress={() => setScreen(SCREEN.CURRENCY)}
      >
        <Text style={s.giveTxt}>Continue →</Text>
      </TouchableOpacity>

      {/* Recent giving history */}
      {loadingHistory
        ? <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 24 }} />
        : history.length > 0 && (
          <>
            <Text style={[s.sectionLabel, { marginTop: 28 }]}>Recent Giving</Text>
            <View style={s.card}>
              {history.map((item, i) => (
                <View key={item.id ?? i} style={i === history.length - 1 ? s.rowLast : s.histRow}>
                  <View>
                    <Text style={s.histType}>{item.type}</Text>
                    <Text style={s.histDate}>{new Date(item.date).toLocaleDateString()}</Text>
                  </View>
                  <Text style={s.histAmt}>
                    {CURRENCIES.find(c => c.id === item.currency)?.symbol ?? '₦'}
                    {item.amount?.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )
      }
    </ScrollView>
  );

  // ─── SCREEN: CURRENCY ─────────────────────────────────────────────────────
  if (screen === SCREEN.CURRENCY) return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <TouchableOpacity style={s.backBtn} onPress={() => setScreen(SCREEN.TYPE)}>
        <ArrowLeft size={18} color={colors.primary} /><Text style={s.backTxt}>Back</Text>
      </TouchableOpacity>
      <Text style={s.title}>Currency</Text>
      <Text style={s.subtitle}>Select your currency</Text>

      <Text style={s.sectionLabel}>Available Currencies</Text>
      <View style={s.card}>
        {CURRENCIES.map((c, i) => (
          <TouchableOpacity
            key={c.id}
            style={i === CURRENCIES.length - 1 ? s.rowLast : s.row}
            onPress={() => setCurrency(c.id)}
          >
            <Text style={{ fontSize: 26, marginRight: 12 }}>{c.flag}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.rowLabel}>{c.label}</Text>
              <Text style={s.rowDesc}>{c.id} · {c.symbol}</Text>
            </View>
            <View style={currency === c.id ? s.check : s.uncheck}>
              {currency === c.id && <Text style={s.checkTxt}>✓</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[s.giveBtn, !currency && s.giveDis]}
        disabled={!currency}
        onPress={() => setScreen(SCREEN.AMOUNT)}
      >
        <Text style={s.giveTxt}>Continue →</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // ─── SCREEN: AMOUNT ───────────────────────────────────────────────────────
  if (screen === SCREEN.AMOUNT) return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <TouchableOpacity style={s.backBtn} onPress={() => setScreen(SCREEN.CURRENCY)}>
        <ArrowLeft size={18} color={colors.primary} /><Text style={s.backTxt}>Back</Text>
      </TouchableOpacity>
      <Text style={s.title}>Amount</Text>
      <Text style={s.subtitle}>{givingObj?.label} · {currencyObj?.label}</Text>

      {/* Big display */}
      <View style={s.amtDisplay}>
        <Text style={s.amtSymbol}>{currencyObj?.symbol}</Text>
        <Text style={s.amtValue}>
          {customAmt || (selectedAmt ? selectedAmt.toLocaleString() : '0')}
        </Text>
      </View>

      {/* Quick amounts */}
      <Text style={s.sectionLabel}>Quick Select</Text>
      <View style={s.quickGrid}>
        {quickAmounts.map(a => (
          <TouchableOpacity
            key={a}
            style={[s.quickBtn, selectedAmt === a && s.quickActive]}
            onPress={() => { setSelectedAmt(a); setCustomAmt(''); }}
          >
            <Text style={[s.quickTxt, selectedAmt === a && s.quickTxtAct]}>
              {currencyObj?.symbol}{a.toLocaleString()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom input */}
      <Text style={s.sectionLabel}>Custom Amount</Text>
      <View style={s.inputWrap}>
        <Text style={s.inputSym}>{currencyObj?.symbol}</Text>
        <TextInput
          style={s.input}
          placeholder="0.00"
          placeholderTextColor={colors.secondary}
          keyboardType="numeric"
          value={customAmt}
          onChangeText={t => { setCustomAmt(t); setSelectedAmt(null); }}
        />
      </View>

      <TouchableOpacity
        style={[s.giveBtn, finalAmount <= 0 && s.giveDis]}
        disabled={finalAmount <= 0}
        onPress={() => setScreen(SCREEN.PAYMENT)}
      >
        <Text style={s.giveTxt}>Continue →</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // ─── SCREEN: PAYMENT ─────────────────────────────────────────────────────
  if (screen === SCREEN.PAYMENT) return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <TouchableOpacity style={s.backBtn} onPress={() => setScreen(SCREEN.AMOUNT)}>
        <ArrowLeft size={18} color={colors.primary} /><Text style={s.backTxt}>Back</Text>
      </TouchableOpacity>
      <Text style={s.title}>Payment</Text>
      <Text style={s.subtitle}>Choose how to give</Text>

      {/* Summary pill */}
      <View style={s.summaryPill}>
        <Text style={s.summaryTxt}>{givingObj?.icon} {givingObj?.label}</Text>
        <Text style={s.summaryAmt}>{fmtAmt(finalAmount, currency!)}</Text>
      </View>

      {/* Payment method list */}
      <Text style={s.sectionLabel}>Payment Methods</Text>
      <View style={s.card}>
        {paymentMethods.map((pm, i) => (
          <TouchableOpacity
            key={pm.id}
            style={i === paymentMethods.length - 1 ? s.rowLast : s.row}
            onPress={() => setPaymentMethod(pm.id)}
          >
            <View style={[s.payIconBox, { backgroundColor: pm.bg }]}>
              <Text style={[s.payIconTxt, { color: pm.fg }]}>{pm.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.rowLabel}>{pm.label}</Text>
              <Text style={s.rowDesc}>{pm.desc}</Text>
              {/* Show USSD code inline so user knows the fallback */}
              {pm.ussd && (
                <Text style={{ fontSize: 11, color: colors.primary, marginTop: 2 }}>
                  No app? Dial {pm.ussd}
                </Text>
              )}
            </View>
            <View style={[s.radioOuter, paymentMethod === pm.id && s.radioActive]}>
              {paymentMethod === pm.id && <View style={s.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Order summary */}
      <Text style={s.sectionLabel}>Summary</Text>
      <View style={s.card}>
        <View style={s.rcptRow}>
          <Text style={s.rcptKey}>Giving Type</Text>
          <Text style={s.rcptVal}>{givingObj?.label}</Text>
        </View>
        <View style={s.rcptRow}>
          <Text style={s.rcptKey}>Amount</Text>
          <Text style={[s.rcptVal, { color: colors.primary }]}>{fmtAmt(finalAmount, currency!)}</Text>
        </View>
        <View style={s.rcptRow}>
          <Text style={s.rcptKey}>Currency</Text>
          <Text style={s.rcptVal}>{currencyObj?.flag} {currencyObj?.label}</Text>
        </View>
        {paymentMethod && (
          <View style={[s.rcptRow, { marginBottom: 0 }]}>
            <Text style={s.rcptKey}>Via</Text>
            <Text style={s.rcptVal}>{paymentObj?.label}</Text>
          </View>
        )}
      </View>

      {/* Give button */}
      <TouchableOpacity
        style={[s.giveBtn, (!paymentMethod || processing) && s.giveDis]}
        disabled={!paymentMethod || processing}
        onPress={handleGive}
      >
        {processing
          ? <ActivityIndicator color="#fff" />
          : <Text style={s.giveTxt}>Give {fmtAmt(finalAmount, currency!)} Now</Text>
        }
      </TouchableOpacity>
      <Text style={s.trustNote}>🔒 Secured & encrypted giving</Text>

      {/* Bank transfer bottom sheet */}
      <BankTransferModal
        visible={transferModal.visible}
        bankId={transferModal.bankId}
        onClose={() => {
          setTransferModal({ visible: false });
          recordDonation();
          setScreen(SCREEN.SUCCESS);
        }}
        currency={currency!}
        amount={finalAmount}
        reference={txRef}
      />
    </ScrollView>
  );

  // ─── SCREEN: SUCCESS ──────────────────────────────────────────────────────
  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.successWrap}>
        <View style={s.successRing}>
          <Text style={{ fontSize: 40, color: '#fff' }}>✓</Text>
        </View>
        <Text style={s.successTitle}>God Bless You!</Text>
        <Text style={s.successMsg}>
          Your {givingObj?.label?.toLowerCase()} of {fmtAmt(finalAmount, currency!)} has been received.
        </Text>
        <Text style={s.successVerse}>"Give, and it will be given to you." — Luke 6:38</Text>
      </View>

      <Text style={s.sectionLabel}>Receipt</Text>
      <View style={s.card}>
        <View style={s.rcptRow}>
          <Text style={s.rcptKey}>Reference</Text>
          <Text style={s.rcptVal}>{txRef}</Text>
        </View>
        <View style={s.rcptRow}>
          <Text style={s.rcptKey}>Type</Text>
          <Text style={s.rcptVal}>{givingObj?.label}</Text>
        </View>
        <View style={s.rcptRow}>
          <Text style={s.rcptKey}>Amount</Text>
          <Text style={[s.rcptVal, { color: colors.primary }]}>{fmtAmt(finalAmount, currency!)}</Text>
        </View>
        <View style={s.rcptRow}>
          <Text style={s.rcptKey}>Currency</Text>
          <Text style={s.rcptVal}>{currencyObj?.flag} {currencyObj?.label}</Text>
        </View>
        <View style={[s.rcptRow, { marginBottom: 0 }]}>
          <Text style={s.rcptKey}>Via</Text>
          <Text style={s.rcptVal}>{paymentObj?.label}</Text>
        </View>
      </View>

      <TouchableOpacity style={s.giveBtn} onPress={reset}>
        <Text style={s.giveTxt}>Give Again</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
