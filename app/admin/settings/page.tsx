'use client';
import { useState, useEffect } from 'react';
import {
    Save, Palette, Globe, Link as LinkIcon, Activity, Upload,
    Image as ImageIcon, FileText, BarChart, Settings2, UserCog,
    Lock, Key, Mail, Check, X, Shield, Crown, UserPlus
} from 'lucide-react';

interface ISettings {
    siteName: string;
    siteTagline: string;
    logoUrl: string;
    logoDarkUrl: string;
    faviconUrl: string;
    ogImageUrl: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
    contactEmail: string;
    supportEmail: string;
    contactPhone: string;
    address: string;
    socialLinks: Record<string, string>;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    googleAnalyticsId: string;
    facebookPixelId: string;
    termsUrl: string;
    privacyUrl: string;
    aboutUrl: string;
    maintenanceMode: boolean;
    maintenanceMessage: string;
    registrationEnabled: boolean;
    commentsEnabled: boolean;
    footerText: string;
    copyrightText: string;
    openaiKey: string;
    geminiKey: string;
    uiDesign: 'classic' | 'modern' | 'vip';
}

interface IUser {
    _id: string;
    name: string;
    email: string;
    role: string;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<ISettings>({
        siteName: '',
        siteTagline: '',
        logoUrl: '',
        logoDarkUrl: '',
        faviconUrl: '',
        ogImageUrl: '',
        metaTitle: '',
        metaDescription: '',
        metaKeywords: [],
        contactEmail: '',
        supportEmail: '',
        contactPhone: '',
        address: '',
        socialLinks: {},
        primaryColor: '#DDA430',
        secondaryColor: '#101010',
        accentColor: '#E75153',
        googleAnalyticsId: '',
        facebookPixelId: '',
        termsUrl: '',
        privacyUrl: '',
        aboutUrl: '',
        maintenanceMode: false,
        maintenanceMessage: '',
        registrationEnabled: true,
        commentsEnabled: true,
        footerText: '',
        copyrightText: '',
        openaiKey: '',
        geminiKey: '',
        uiDesign: 'vip',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('branding');
    const [uploading, setUploading] = useState(false);
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);

    useEffect(() => {
        fetchSettings();
        fetchCurrentUser();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            const data = await res.json();
            if (data.user) setCurrentUser(data.user);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            if (!data.error) {
                setSettings((prev: ISettings) => ({ ...prev, ...data }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                body: JSON.stringify(settings),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                alert('✅ Settings saved successfully! Your changes are now live.');
            } else {
                alert('❌ Failed to save settings. Please try again.');
            }
        } catch (err) {
            console.error(err);
            alert('❌ Error saving settings.');
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setSettings({ ...settings, [field]: data.url } as ISettings);
                alert(`✅ ${field} uploaded successfully!`);
            } else {
                alert(`❌ Upload failed: ${data.error}`);
            }
        } catch (err) {
            console.error(err);
            alert('❌ Upload error');
        } finally {
            setUploading(false);
        }
    };

    const updateKeywords = (value: string) => {
        const keywords = value.split(',').map(k => k.trim()).filter(Boolean);
        setSettings({ ...settings, metaKeywords: keywords });
    };

    if (loading) return (
        <div className="p-8 text-center text-muted-foreground animate-pulse font-black uppercase tracking-[0.2em] py-32">
            Loading Configuration...
        </div>
    );

    const tabs = [
        { id: 'branding', label: 'Branding', icon: <ImageIcon size={16} /> },
        { id: 'seo', label: 'SEO', icon: <BarChart size={16} /> },
        { id: 'social', label: 'Social', icon: <LinkIcon size={16} /> },
        { id: 'theme', label: 'Theme', icon: <Palette size={16} /> },
        { id: 'ai', label: 'AI Integration', icon: <Activity size={16} /> },
        { id: 'analytics', label: 'Analytics', icon: <Activity size={16} /> },
        { id: 'legal', label: 'Legal', icon: <FileText size={16} /> },
        { id: 'features', label: 'Features', icon: <Settings2 size={16} /> },
        { id: 'account', label: 'Account', icon: <UserCog size={16} /> },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-10 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black text-foreground uppercase tracking-tighter">
                        Site <span className="text-primary">Configuration</span>
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium mt-2">
                        Complete control over your site's branding, SEO, and functionality - Amazon-level customization.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center justify-center gap-3 px-10 py-4 bg-primary hover:opacity-90 active:scale-95 text-primary-foreground font-black text-xs uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50 shadow-2xl shadow-primary/20"
                >
                    {saving ? 'Saving...' : <><Save size={18} /> Save All Changes</>}
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 p-1.5 bg-muted rounded-3xl w-full overflow-x-auto no-scrollbar border border-border">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 text-[10px] font-black tracking-widest transition-all rounded-2xl whitespace-nowrap uppercase ${activeTab === tab.id
                            ? 'bg-background text-primary shadow-xl ring-1 ring-primary/20'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-card border border-border rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12">
                {activeTab === 'branding' && (
                    <div className="space-y-8">
                        <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-6">Brand Identity</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Site Name"
                                value={settings.siteName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, siteName: e.target.value })}
                                placeholder="Enter your site name"
                            />
                            <InputField
                                label="Site Tagline"
                                value={settings.siteTagline}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, siteTagline: e.target.value })}
                                placeholder="Your site's tagline or slogan"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FileUploadField
                                label="Logo URL (Light Mode)"
                                value={settings.logoUrl}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, logoUrl: e.target.value })}
                                onFileUpload={(e: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(e, 'logoUrl')}
                                uploading={uploading}
                                preview={settings.logoUrl}
                            />
                            <FileUploadField
                                label="Logo URL (Dark Mode)"
                                value={settings.logoDarkUrl}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, logoDarkUrl: e.target.value })}
                                onFileUpload={(e: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(e, 'logoDarkUrl')}
                                uploading={uploading}
                                preview={settings.logoDarkUrl}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FileUploadField
                                label="Favicon URL"
                                value={settings.faviconUrl}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, faviconUrl: e.target.value })}
                                onFileUpload={(e: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(e, 'faviconUrl')}
                                uploading={uploading}
                                preview={settings.faviconUrl}
                            />
                            <FileUploadField
                                label="OG Image (Social Share)"
                                value={settings.ogImageUrl}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, ogImageUrl: e.target.value })}
                                onFileUpload={(e: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(e, 'ogImageUrl')}
                                uploading={uploading}
                                preview={settings.ogImageUrl}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'seo' && (
                    <div className="space-y-8">
                        <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-6">SEO & Metadata</h2>

                        <InputField
                            label="Meta Title"
                            value={settings.metaTitle}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, metaTitle: e.target.value })}
                            placeholder="Your site's meta title (50-60 characters)"
                        />

                        <TextareaField
                            label="Meta Description"
                            value={settings.metaDescription}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSettings({ ...settings, metaDescription: e.target.value })}
                            placeholder="Your site's meta description (150-160 characters)"
                            rows={3}
                        />

                        <InputField
                            label="Meta Keywords (comma separated)"
                            value={settings.metaKeywords?.join(', ') || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateKeywords(e.target.value)}
                            placeholder="gaming, casino, premium, assets, etc."
                        />
                    </div>
                )}


                {activeTab === 'social' && (
                    <div className="space-y-8">
                        <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-6">Social Media Links</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {['facebook', 'twitter', 'instagram', 'youtube', 'linkedin', 'telegram', 'discord', 'whatsapp'].map(platform => (
                                <InputField
                                    key={platform}
                                    label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                                    value={settings.socialLinks?.[platform] || ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({
                                        ...settings,
                                        socialLinks: { ...settings.socialLinks, [platform]: e.target.value }
                                    })}
                                    placeholder={`https://${platform}.com/yourprofile`}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'theme' && (
                    <div className="space-y-12">
                        <section>
                            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-6">Theme Colors</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <ColorPickerField
                                    label="Primary Color"
                                    value={settings.primaryColor}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, primaryColor: e.target.value })}
                                />
                                <ColorPickerField
                                    label="Secondary Color"
                                    value={settings.secondaryColor}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, secondaryColor: e.target.value })}
                                />
                                <ColorPickerField
                                    label="Accent Color"
                                    value={settings.accentColor}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, accentColor: e.target.value })}
                                />
                            </div>
                        </section>

                    </div>
                )}

                {activeTab === 'ai' && (
                    <div className="space-y-8">
                        <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-6">AI Integration</h2>

                        <div className="space-y-6">
                            <InputField
                                label="OpenAI API Key"
                                type="password"
                                value={settings.openaiKey}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, openaiKey: e.target.value })}
                                placeholder="sk-..."
                            />
                            <InputField
                                label="Google Gemini API Key"
                                type="password"
                                value={settings.geminiKey}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, geminiKey: e.target.value })}
                                placeholder="AIzaSy..."
                            />
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed p-4 bg-muted/30 rounded-xl border border-border mt-4">
                                These keys enable high-level autonomous rearrangement and SEO humanization protocols. They remain encrypted and protected.
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="space-y-8">
                        <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-6">Analytics & Tracking</h2>

                        <InputField
                            label="Google Analytics ID"
                            value={settings.googleAnalyticsId}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                            placeholder="G-XXXXXXXXXX"
                        />

                        <InputField
                            label="Facebook Pixel ID"
                            value={settings.facebookPixelId}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, facebookPixelId: e.target.value })}
                            placeholder="123456789"
                        />
                    </div>
                )}

                {activeTab === 'legal' && (
                    <div className="space-y-8">
                        <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-6">Legal Pages</h2>

                        <InputField
                            label="Terms of Service URL"
                            value={settings.termsUrl}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, termsUrl: e.target.value })}
                            placeholder="/terms"
                        />

                        <InputField
                            label="Privacy Policy URL"
                            value={settings.privacyUrl}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, privacyUrl: e.target.value })}
                            placeholder="/privacy"
                        />

                        <InputField
                            label="About Page URL"
                            value={settings.aboutUrl}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, aboutUrl: e.target.value })}
                            placeholder="/about"
                        />

                        <TextareaField
                            label="Footer Text"
                            value={settings.footerText}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSettings({ ...settings, footerText: e.target.value })}
                            placeholder="Custom footer text..."
                            rows={2}
                        />

                        <InputField
                            label="Copyright Text"
                            value={settings.copyrightText}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, copyrightText: e.target.value })}
                            placeholder="© 2024 YourSite. All rights reserved."
                        />
                    </div>
                )}

                {activeTab === 'features' && (
                    <div className="space-y-8">
                        <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-6">Site Features</h2>

                        <ToggleField
                            label="Maintenance Mode"
                            checked={settings.maintenanceMode}
                            onChange={(checked: boolean) => setSettings({ ...settings, maintenanceMode: checked })}
                            description="Enable to show maintenance page to visitors"
                        />

                        {settings.maintenanceMode && (
                            <TextareaField
                                label="Maintenance Message"
                                value={settings.maintenanceMessage}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                                placeholder="We're currently performing maintenance. We'll be back soon!"
                                rows={2}
                            />
                        )}

                        <ToggleField
                            label="User Registration"
                            checked={settings.registrationEnabled}
                            onChange={(checked: boolean) => setSettings({ ...settings, registrationEnabled: checked })}
                            description="Allow new users to register"
                        />

                        <ToggleField
                            label="Comments"
                            checked={settings.commentsEnabled}
                            onChange={(checked: boolean) => setSettings({ ...settings, commentsEnabled: checked })}
                            description="Enable comments on blog posts and games"
                        />
                    </div>
                )}

                {activeTab === 'account' && currentUser && (
                    <div className="space-y-12">
                        <div className="space-y-8">
                            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Personal Configuration</h2>

                            <div className="space-y-8">
                                <div className="p-6 bg-muted/20 border border-border rounded-3xl">
                                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <UserPlus size={18} className="text-primary" /> Identity Update
                                    </h3>
                                    <ChangeNameForm currentName={currentUser.name} onUpdate={fetchCurrentUser} />
                                </div>

                                <div className="p-6 bg-muted/20 border border-border rounded-3xl">
                                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <Mail size={18} className="text-primary" /> Communication Channel
                                    </h3>
                                    <ChangeEmailForm currentEmail={currentUser.email} onUpdate={fetchCurrentUser} userId={currentUser._id} />
                                </div>

                                <div className="p-6 bg-muted/20 border border-border rounded-3xl">
                                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <Lock size={18} className="text-primary" /> Access Credentials
                                    </h3>
                                    <ChangePasswordForm userId={currentUser._id} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper Interfaces
interface InputFieldProps {
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

interface TextareaFieldProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
}

interface ColorPickerFieldProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface FileUploadFieldProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    uploading: boolean;
    preview?: string;
}

interface ToggleFieldProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description?: string;
}

function InputField({ label, type = 'text', value, onChange, placeholder }: InputFieldProps) {
    return (
        <div className="space-y-2">
            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">{label}</label>
            <input
                type={type}
                value={value || ''}
                onChange={onChange}
                className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold"
                placeholder={placeholder}
            />
        </div>
    );
}

function TextareaField({ label, value, onChange, placeholder, rows = 3 }: TextareaFieldProps) {
    return (
        <div className="space-y-2">
            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">{label}</label>
            <textarea
                value={value || ''}
                onChange={onChange}
                rows={rows}
                className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold resize-none"
                placeholder={placeholder}
            />
        </div>
    );
}

function ColorPickerField({ label, value, onChange }: ColorPickerFieldProps) {
    return (
        <div className="space-y-2">
            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">{label}</label>
            <div className="flex gap-4">
                <input
                    type="color"
                    value={value || '#000000'}
                    onChange={onChange}
                    className="w-20 h-14 bg-muted/30 border border-border rounded-2xl cursor-pointer"
                />
                <input
                    type="text"
                    value={value || ''}
                    onChange={onChange}
                    className="flex-1 bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-mono font-bold"
                    placeholder="#000000"
                />
            </div>
        </div>
    );
}

function FileUploadField({ label, value, onChange, onFileUpload, uploading, preview }: FileUploadFieldProps) {
    return (
        <div className="space-y-4">
            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">{label}</label>
            <div className="flex flex-col gap-4">
                <input
                    type="text"
                    value={value || ''}
                    onChange={onChange}
                    className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold"
                    placeholder="https://..."
                />
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 px-6 py-3 bg-muted border border-border rounded-2xl cursor-pointer hover:bg-muted/50 transition-all font-black text-[10px] uppercase tracking-widest">
                        <Upload size={14} /> {uploading ? 'Processing...' : 'Upload Asset'}
                        <input type="file" className="hidden" onChange={onFileUpload} disabled={uploading} />
                    </label>
                    {preview && (
                        <div className="h-12 w-12 rounded-xl overflow-hidden border border-border bg-white">
                            <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ToggleField({ label, checked, onChange, description }: ToggleFieldProps) {
    return (
        <div className="flex items-center justify-between p-6 bg-muted/20 border border-border rounded-[2rem] hover:bg-muted/30 transition-all">
            <div>
                <div className="text-sm font-black text-foreground uppercase tracking-tight">{label}</div>
                {description && <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-1">{description}</p>}
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`relative w-14 h-8 rounded-full transition-all ${checked ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-muted'}`}
            >
                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all ${checked ? 'translate-x-6 shadow-md' : 'translate-x-0'}`} />
            </button>
        </div>
    );
}

// Sub-forms for account management
function ChangeNameForm({ currentName, onUpdate }: { currentName: string, onUpdate: () => void }) {
    const [newName, setNewName] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleRequest = async () => {
        if (!newName) return alert('Enter new name');
        setLoading(true);
        try {
            const res = await fetch('/api/auth/name/request-change', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newName })
            });
            if (res.ok) setStep(2);
            else alert('Failed to request change');
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/name/confirm-change', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });
            if (res.ok) {
                alert('Name updated');
                onUpdate();
                setStep(1);
                setNewName('');
            } else alert('Invalid code');
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Alias</label>
                <div className="px-6 py-4 bg-muted/50 rounded-2xl border border-border border-dashed text-muted-foreground font-bold">{currentName}</div>
            </div>
            {step === 1 ? (
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">New Target</label>
                    <div className="flex gap-2">
                        <input value={newName} onChange={e => setNewName(e.target.value)} className="flex-1 bg-muted/30 border border-border rounded-xl px-4 py-2 text-sm font-bold" />
                        <button onClick={handleRequest} disabled={loading} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-black text-[10px] uppercase">Verify</button>
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Verification Code</label>
                    <div className="flex gap-2">
                        <input value={code} onChange={e => setCode(e.target.value)} className="flex-1 bg-muted/30 border border-border rounded-xl px-4 py-2 text-sm font-bold text-center tracking-widest" maxLength={6} />
                        <button onClick={handleVerify} disabled={loading} className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase">Confirm</button>
                    </div>
                    <button onClick={() => setStep(1)} className="text-[9px] text-primary font-bold uppercase underline">Cancel</button>
                </div>
            )}
        </div>
    );
}

function ChangeEmailForm({ currentEmail, onUpdate, userId }: { currentEmail: string, onUpdate: () => void, userId: string }) {
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        if (!newEmail) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: newEmail })
            });
            if (res.ok) {
                alert('Email updated');
                onUpdate();
                setNewEmail('');
            } else alert('Update failed');
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Email</label>
                <div className="px-6 py-4 bg-muted/50 rounded-2xl border border-border border-dashed text-muted-foreground font-bold">{currentEmail}</div>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Update Target</label>
                <div className="flex gap-2">
                    <input value={newEmail} onChange={e => setNewEmail(e.target.value)} className="flex-1 bg-muted/30 border border-border rounded-xl px-4 py-2 text-sm font-bold" />
                    <button onClick={handleUpdate} disabled={loading} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-black text-[10px] uppercase">Update</button>
                </div>
            </div>
        </div>
    );
}

function ChangePasswordForm({ userId }: { userId: string }) {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (password !== confirm || !password) return alert('Check passwords');
        setLoading(true);
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            if (res.ok) {
                alert('Password updated');
                setPassword('');
                setConfirm('');
            } else alert('Update failed');
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">New Key</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2 text-sm font-bold" />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Confirm Key</label>
                <div className="flex gap-2">
                    <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="flex-1 bg-muted/30 border border-border rounded-xl px-4 py-2 text-sm font-bold" />
                    <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-black text-[10px] uppercase">Update</button>
                </div>
            </div>
        </div>
    );
}
