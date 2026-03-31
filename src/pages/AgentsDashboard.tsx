import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { LayoutDashboard, CheckCircle, Truck, History, Settings, User } from 'lucide-react';
import VerificationAgentDashboard from './VerificationAgentDashboard';
import DeliveryAgentDashboard from './DeliveryAgentDashboard';
import DashboardLayout from '@/components/DashboardLayout';

export default function AgentsDashboard() {
 const { role } = useParams<{ role: string }>();
 const [searchParams, setSearchParams] = useSearchParams();
 const isVerify = role === 'verify';

 // Depending on what we want to test first, you can use the activeTab from searchParams or default
 const activeTab = searchParams.get('tab') || 'Dashboard';
 const setActiveTab = (tab: string) => setSearchParams({ tab });

 const sidebarItems = isVerify ? [
 { icon: LayoutDashboard, label: 'Dashboard', active: activeTab === 'Dashboard', onClick: () => setActiveTab('Dashboard') },
 { icon: CheckCircle, label: 'Verifications', active: activeTab === 'Verifications', onClick: () => setActiveTab('Verifications') },
 { icon: History, label: 'History', active: activeTab === 'History', onClick: () => setActiveTab('History') },
 { icon: Settings, label: 'Settings', active: activeTab === 'Settings', onClick: () => setActiveTab('Settings') },
 ] : [
 { icon: LayoutDashboard, label: 'Dashboard', active: activeTab === 'Dashboard', onClick: () => setActiveTab('Dashboard') },
 { icon: Truck, label: 'Active Runs', active: activeTab === 'Active Runs', onClick: () => setActiveTab('Active Runs') },
 { icon: History, label: 'History', active: activeTab === 'History', onClick: () => setActiveTab('History') },
 { icon: Settings, label: 'Settings', active: activeTab === 'Settings', onClick: () => setActiveTab('Settings') },
 ];

 return (
 <DashboardLayout 
 sidebarItems={sidebarItems} 
 title={isVerify ? "Verification Agent" : "Delivery Agent"} 
 portalType="agent"
 >
 <div className="relative z-10">
 {isVerify ? <VerificationAgentDashboard /> : <DeliveryAgentDashboard />}
 </div>
 </DashboardLayout>
 );
}
