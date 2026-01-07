'use client';
import { useState, useEffect } from 'react';
import { Save, Palette, Globe, Link as LinkIcon, Activity, Upload, Image as ImageIcon, FileText, BarChart, Settings2 } from 'lucide-react';

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
}

export default function EnhancedSettingsPage() {
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
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('branding');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            if (!data.error) {
                setSettings(prev => ({ ...prev, ...data }));
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
                setSettings({ ...settings, [field]: data.url });
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
        { id: 'contact', label: 'Contact', icon: <Globe size={16} /> },
        { id: 'social', label: 'Social', icon: <LinkIcon size={16} /> },
        { id: 'theme', label: 'Theme', icon: <Palette size={16} /> },
        { id: 'analytics', label: 'Analytics', icon: <Activity size={16} /> },
        { id: 'legal', label: 'Legal', icon: <FileText size={16} /> },
        { id: 'features', label: 'Features', icon: <Settings2 size={16} /> },
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

                {activeTab === 'contact' && (
                    <div className="space-y-8">
                        <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-6">Contact Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Contact Email"
                                type="email"
                                value={settings.contactEmail}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, contactEmail: e.target.value })}
                                placeholder="contact@yoursite.com"
                            />
                            <InputField
                                label="Support Email"
                                type="email"
                                value={settings.supportEmail}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, supportEmail: e.target.value })}
                                placeholder="support@yoursite.com"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Contact Phone"
                                type="tel"
                                value={settings.contactPhone}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, contactPhone: e.target.value })}
                                placeholder="+1 (555) 123-4567"
                            />
                            <InputField
                                label="Physical Address"
                                value={settings.address}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, address: e.target.value })}
                                placeholder="123 Main St, City, Country"
                            />
                        </div>
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
                    <div className="space-y-8">
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
            </div>
        </div>
    );
}

// Helper Component Interfaces
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

// Helper Components
function InputField({ label, type = 'text', value, onChange, placeholder }: InputFieldProps) {
    return (
        <div className="space-y-2">
            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{label}</label>
            <input
                type={type}
                value={value || ''}
                onChange={onChange}
                className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                placeholder={placeholder}
            />
        </div>
    );
}

function TextareaField({ label, value, onChange, placeholder, rows = 3 }: TextareaFieldProps) {
    return (
        <div className="space-y-2">
            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{label}</label>
            <textarea
                value={value || ''}
                onChange={onChange}
                rows={rows}
                className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium resize-none"
                placeholder={placeholder}
            />
        </div>
    );
}

function ColorPickerField({ label, value, onChange }: ColorPickerFieldProps) {
    return (
        <div className="space-y-2">
            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{label}</label>
            <div className="flex gap-3 items-center">
                <input
                    type="color"
                    value={value || '#000000'}
                    onChange={onChange}
                    className="h-12 w-16 rounded-lg border-2 border-border cursor-pointer"
                />
                <input
                    type="text"
                    value={value || ''}
                    onChange={onChange}
                    className="flex-1 bg-muted/30 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm"
                    placeholder="#000000"
                />
            </div>
        </div>
    );
}

function FileUploadField({ label, value, onChange, onFileUpload, uploading, preview }: FileUploadFieldProps) {
    return (
        <div className="space-y-3">
            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{label}</label>
            <input
                type="text"
                value={value || ''}
                onChange={onChange}
                className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                placeholder="https://example.com/image.png"
            />
            <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg cursor-pointer transition-all font-bold text-sm">
                    <Upload size={16} />
                    {uploading ? 'Uploading...' : 'Upload'}
                    <input type="file" accept="image/*" onChange={onFileUpload} className="hidden" disabled={uploading} />
                </label>
                {preview && (
                    <div className="flex-1 p-2 bg-muted/50 rounded-lg border border-border">
                        <img src={preview} alt="Preview" className="h-12 object-contain" />
                    </div>
                )}
            </div>
        </div>
    );
}

function ToggleField({ label, checked, onChange, description }: ToggleFieldProps) {
    return (
        <div className="flex items-start justify-between gap-4 p-4 bg-muted/30 rounded-xl border border-border">
            <div>
                <div className="text-sm font-black text-foreground uppercase tracking-wide">{label}</div>
                {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`relative w-14 h-8 rounded-full transition-all ${checked ? 'bg-primary' : 'bg-muted'}`}
            >
                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
        </div>
    );
}
