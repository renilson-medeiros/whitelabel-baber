"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select";

import {
  Calendar,
  XCircle,
  Clock,
  TrendingUp,
  DollarSign,
  CircleCheck,
  LoaderCircle,
} from "lucide-react";

import Link from "next/link";
import { PageContainer } from "@/app/_components/ui/page";
import Footer from "@/app/_components/footer";

type Period = "day" | "week" | "month";

interface ServiceData {
  name: string;
  count: number;
  total: number; // em CENTAVOS
}

interface StatsData {
  scheduled: number;
  completed: number;
  cancelled: number;
  services: ServiceData[];
}

export default function Dashboard() {
  const [period, setPeriod] = useState<Period>("day");
  const [data, setData] = useState<StatsData>({
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    services: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Formatação BRL
  const formatBRL = (valueInCents: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(valueInCents / 100);

  // Busca dados da API
  const loadStats = async (p: Period) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/admin/stats?period=${p}`);
      if (!res.ok) throw new Error("Erro ao carregar dados");
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Erro ao carregar stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats(period);
  }, [period]);

  // Cálculos
  const pending = data.scheduled - data.completed - data.cancelled;
  const totalRevenueCents = data.services.reduce((sum, s) => sum + s.total, 0);
  const totalServicesCount = data.services.reduce((sum, s) => sum + s.count, 0);

  const periodLabels = {
    day: "Hoje",
    week: "Esta Semana",
    month: "Este Mês"
  };

  if (isLoading) {
    return (
      <div className="flex gap-2 h-screen items-center justify-center">
        <LoaderCircle className="animate-spin text-blue-500" />
        <p className="text-blue-500 ">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen min-h-screen flex-col">
      <PageContainer>
        {/* Header */}
        <header>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex justify-between items-baseline-last flex-1 w-full sm:items-center">
              <h1 className="text-2xl font-bold">Dashboard</h1>

              <div className="flex gap-4">
                <Link href="/admin/services">
                  <p className="text-sm text-muted-foreground hover:underline">
                    Serviços
                  </p>
                </Link>

                <Link href="/admin/panel">
                  <p className="text-sm text-muted-foreground hover:underline">
                    Agendamentos
                  </p>
                </Link>
              </div>

            </div>

            {/* Filter */}
            <div className="w-full sm:w-auto">
              <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
                <SelectTrigger className="border-border md:w-36 w-full bg-card text-foreground">
                  <SelectValue placeholder="Selecionar período" />
                </SelectTrigger>
                <SelectContent className="border-border bg-card">
                  <SelectItem value="day">Hoje</SelectItem>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pb-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Scheduled (Confirmados) */}
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  Agendamentos
                </CardTitle>
                <Calendar className="h-5 w-5 text-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{data.scheduled}</div>
                <p className="text-xs text-muted-foreground mt-1">{periodLabels[period]}</p>
              </CardContent>
            </Card>

            {/* Completed (Finalizados) */}
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  Finalizados
                </CardTitle>
                <CircleCheck className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{data.completed}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.scheduled === 0
                    ? "0%"
                    : `${((data.completed / data.scheduled) * 100).toFixed(0)}% do total`}
                </p>
              </CardContent>
            </Card>

            {/* Cancelled */}
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  Cancelados
                </CardTitle>
                <XCircle className="h-5 w-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{data.cancelled}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.scheduled === 0
                    ? "0%"
                    : `${((data.cancelled / data.scheduled) * 100).toFixed(0)}% do total`}
                </p>
              </CardContent>
            </Card>

            {/* Pending */}
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  Pendentes
                </CardTitle>
                <Clock className="h-5 w-5 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{pending}</div>
                <p className="text-xs text-muted-foreground mt-1">Aguardando atendimento</p>
              </CardContent>
            </Card>
          </div>

          {/* Services & Revenue */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Most Performed Services */}
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  <CardTitle className="text-foreground">Serviços Mais Realizados</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {data.services.length > 0 ? (
                  <div className="space-y-4">
                    {data.services.map((s, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{s.name}</p>
                          <p className="text-sm text-muted-foreground">{s.count} vezes</p>
                        </div>
                        <p className="font-semibold text-foreground">{formatBRL(s.total)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhum serviço finalizado neste período
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Revenue */}
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <CardTitle className="text-foreground">Resumo Financeiro</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border border-border bg-muted p-6">
                  <p className="text-sm text-muted-foreground">Receita Total</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">
                    {formatBRL(totalRevenueCents)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{periodLabels[period]}</p>
                </div>

                {data.services.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-foreground">Média por Serviço</p>
                    {data.services.slice(0, 3).map((s, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{s.name}</span>
                        <span className="text-sm font-medium text-foreground">
                          {formatBRL(Math.floor(s.total / s.count))}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="rounded-lg border border-border bg-muted p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total de Serviços</span>
                    <span className="text-lg font-bold text-foreground">
                      {totalServicesCount}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </PageContainer>

      <Footer />
    </div>
  );
}