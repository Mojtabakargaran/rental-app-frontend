'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { 
  Sparkles, 
  Users, 
  Bot, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Clock,
  Shield,
  UserPlus,
  Layers,
  Server,
  Monitor,
  Mail,
  MessageCircle,
  Github,
  ExternalLink,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { Button } from '@/components/ui/button';

export function LandingPage() {
  const t = useTranslations('landing');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">AI Dev Method</span>
            </div>
            <div className="flex items-center gap-4">
              <LanguageToggle variant="ghost" size="sm" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-emerald-50 opacity-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-400/20 to-emerald-400/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            {t('hero.badge')}
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            {t('hero.title')}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
              {t('hero.titleHighlight')}
            </span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 mb-10">
            {t('hero.subtitle')}
          </p>
          
          {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="gap-2 text-base px-8">
                {t('hero.cta.demo')}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="/docs/ImplementedUsecases.pdf" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="gap-2 text-base px-8">
                <BookOpen className="w-4 h-4" />
                {t('hero.cta.docs')}
              </Button>
            </a>
          </div> */}
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {t('overview.title')}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {t('overview.description')}
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-6 border border-blue-100">
              <p className="text-gray-700 italic">
                {t('overview.highlight')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Components Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('coreComponents.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('coreComponents.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Use Case Definition */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('coreComponents.useCase.title')}
              </h3>
              <p className="text-gray-600">
                {t('coreComponents.useCase.description')}
              </p>
            </div>
            
            {/* AI Implementation */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Bot className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('coreComponents.implementation.title')}
              </h3>
              <p className="text-gray-600">
                {t('coreComponents.implementation.description')}
              </p>
            </div>
          </div>
          
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-sm text-blue-800">
                {t('coreComponents.note')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Human vs AI Roles Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('roles.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('roles.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Human Role */}
            <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  {t('roles.human.title')}
                </h3>
                <ul className="space-y-3">
                  {(t.raw('roles.human.items') as string[]).map((item: string, index: number) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-200 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* AI Role */}
            <div className="relative bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-8 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  {t('roles.ai.title')}
                </h3>
                <ul className="space-y-3">
                  {(t.raw('roles.ai.items') as string[]).map((item: string, index: number) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-start gap-3">
              <FileText className="w-5 h-5 text-gray-600 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-700">
                {t('roles.note')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Responsibilities Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('responsibilities.title')}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Authoring */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('responsibilities.authoring.title')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('responsibilities.authoring.description')}
              </p>
              <div className="flex flex-col gap-2">
                <a 
                  href="/docs/ImplementedUsecases.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t('responsibilities.authoring.linkText')}
                </a>
                <a 
                  href="/docs/CompleteSampleUsecase.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t('responsibilities.authoring.sampleLinkText')}
                </a>
              </div>
            </div>
            
            {/* Architecture */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <Layers className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('responsibilities.architecture.title')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('responsibilities.architecture.description')}
              </p>
              <p className="text-sm text-gray-500 italic">
                {t('responsibilities.architecture.note')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Addressed Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('problems.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('problems.intro')}
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Problems */}
            <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold text-red-900">{t('problems.commonIssues')}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {(t.raw('problems.issues') as string[]).map((issue: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 bg-white rounded-lg p-3 border border-red-100">
                    <div className="w-2 h-2 bg-red-400 rounded-full shrink-0" />
                    <span className="text-sm text-red-800">{issue}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Solutions */}
            <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <h3 className="text-lg font-semibold text-emerald-900">{t('problems.solution.title')}</h3>
              </div>
              <ul className="space-y-3">
                {(t.raw('problems.solution.items') as string[]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <ChevronRight className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-emerald-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-8 max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-700 font-medium">
              {t('problems.result')}
            </p>
          </div>
        </div>
      </section>

      {/* Business Impact Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t('impact.title')}
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {(t.raw('impact.items') as Array<{title: string; description: string}>).map((item: {title: string; description: string}, index: number) => {
              const icons = [Zap, Clock, Shield, UserPlus, Layers];
              const Icon = icons[index % icons.length];
              return (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white border border-white/20 hover:bg-white/20 transition-colors">
                  <Icon className="w-8 h-8 text-blue-200 mb-4" />
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-blue-100">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Applicability Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {t('applicability.title')}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {t('applicability.description')}
            </p>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <p className="text-gray-700">
                {t('applicability.migration')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Application Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {t('sample.title')}
            </h2>
            <p className="text-xl text-blue-600 font-medium">
              {t('sample.subtitle')}
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-8">
                <p className="text-gray-600 mb-6">
                  {t('sample.description')}
                </p>
                
                <div className="mb-6">
                  <a 
                    href="/docs/ImplementedUsecases.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t('sample.useCasesLink')}
                  </a>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    {t('sample.features.title')}
                  </h4>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {(t.raw('sample.features.items') as string[]).map((item: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <p className="text-sm text-gray-500 italic mb-6">
                  {t('sample.note')}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/login">
                    <Button size="lg" className="gap-2 w-full sm:w-auto">
                      {t('sample.login')}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                      {t('sample.register')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('techStack.title')}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Backend */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Server className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {t('techStack.backend.title')}
                </h3>
              </div>
              <div className="space-y-3">
                {(t.raw('techStack.backend.items') as Array<{label: string; value: string}>).map((item: {label: string; value: string}, index: number) => (
                  <div key={index} className="flex justify-between items-start gap-4 py-2 border-b border-gray-200 last:border-0">
                    <span className="text-sm text-gray-500 shrink-0">{item.label}</span>
                    <span className="text-sm text-gray-900 font-medium text-end">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Frontend */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {t('techStack.frontend.title')}
                </h3>
              </div>
              <div className="space-y-3">
                {(t.raw('techStack.frontend.items') as Array<{label: string; value: string}>).map((item: {label: string; value: string}, index: number) => (
                  <div key={index} className="flex justify-between items-start gap-4 py-2 border-b border-gray-200 last:border-0">
                    <span className="text-sm text-gray-500 shrink-0">{item.label}</span>
                    <span className="text-sm text-gray-900 font-medium text-end">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* GitHub Repositories */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://github.com/Mojtabakargaran/rental-app-backend" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              <Github className="w-5 h-5" />
              {t('techStack.github.backend')}
            </a>
            <a 
              href="https://github.com/Mojtabakargaran/rental-app-frontend" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              <Github className="w-5 h-5" />
              {t('techStack.github.frontend')}
            </a>
          </div>
        </div>
      </section>

      {/* Collaboration Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t('collaboration.title')}
            </h2>
            <p className="text-lg text-gray-300">
              {t('collaboration.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
            {(t.raw('collaboration.options') as Array<{title: string; description: string}>).map((option: {title: string; description: string}, index: number) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center hover:bg-white/20 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-2">{option.title}</h3>
                <p className="text-sm text-gray-300">{option.description}</p>
              </div>
            ))}
          </div>
          
          {/* Contact Card */}
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-2xl p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('collaboration.contact.title')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('collaboration.contact.description')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href={`mailto:${t('collaboration.contact.email')}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Mail className="w-5 h-5" />
                  {t('collaboration.contact.email')}
                </a>
                <a 
                  href={`https://wa.me/989151246455`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  <MessageCircle className="w-5 h-5" />
                  {t('collaboration.contact.whatsapp')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
