'use client';

import { motion } from "framer-motion";
import { ShieldCheck, CalendarRange, Users, Radio, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const actions = [
  { title: "Events", desc: "Create & publish gatherings", icon: CalendarRange },
  { title: "Livestream", desc: "Update player + links", icon: Radio },
  { title: "People", desc: "Members, guests, volunteers", icon: Users },
  { title: "Content", desc: "Sermons, notes, resources", icon: BookOpen },
];

export default function AdminLanding() {
  return (
    <main className="mx-auto max-w-5xl px-6 pb-16 pt-12 sm:px-10">
      <Card className="glass gradient-border">
        <CardContent className="space-y-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-3">
              <Badge className="bg-brand-600/30 text-brand-50">Admin</Badge>
              <h1 className="text-4xl font-semibold text-white">AAGC Admin Console</h1>
              <p className="max-w-2xl text-white/70">
                Operate the church in one secure dashboard: manage services, track giving,
                assign teams, schedule notifications, and keep the portal fresh.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-brand-500/15 px-4 py-3 text-brand-50">
              <ShieldCheck className="h-5 w-5" />
              Role: Super Admin
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {actions.map(({ title, desc, icon: Icon }, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx }}
              >
                <Card className="border-white/10 bg-white/5">
                  <CardContent className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/25 text-brand-50">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-white">{title}</h3>
                      <p className="text-sm text-white/65">{desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button>Launch Dashboard</Button>
            <Button variant="ghost">View Logs</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

