// Platform configuration
const PLATFORM_CONFIG = {
    'universal': { name: 'Universal', negativePrompt: false, parameters: true },
    'dalle': { name: 'DALL·E', negativePrompt: false, parameters: false },
    'midjourney': { name: 'Midjourney', negativePrompt: false, parameters: true },
    'stable-diffusion': { name: 'Stable Diffusion', negativePrompt: true, parameters: true },
    'gemini': { name: 'Gemini', negativePrompt: false, parameters: false },
    'qwen': { name: 'Qwen', negativePrompt: false, parameters: false }
};

// Color palettes
const COLOR_PALETTES = {
    'warm': 'warm colors, golden tones, amber, orange, warm atmosphere, sunset palette',
    'cool': 'cool colors, blue tones, silver, cool atmosphere, icy, twilight palette',
    'vibrant': 'vibrant colors, saturated, bold colors, colorful, high contrast',
    'pastel': 'pastel colors, soft tones, gentle colors, delicate, muted palette',
    'monochrome': 'monochromatic, black and white, grayscale, tonal values',
    'earthy': 'earth tones, brown, green, natural colors, organic, terracotta, olive'
};

// Template data
const TEMPLATES = [
    {
        id: 1,
        name: "Warung Kopi Filosofis",
        platform: "universal",
        description: "Potret melankolis kehidupan urban tradisional",
        data: {
            mainSubject: "Seorang kakek tua duduk sendirian di warung kopi sederhana di Tangerang, memandang jauh ke jalanan yang sepi",
            visualStyle: "sinematik",
            composition: ["close-up", "medium-shot"],
            lighting: "golden-hour",
            mood: ["melankolis", "nostalgia"],
            aspectRatio: "16:9"
        }
    },
    {
        id: 2,
        name: "Transformasi Sosial - Cyberpunk",
        platform: "midjourney",
        description: "Kontras antara modernitas dan tradisi",
        data: {
            mainSubject: "Pemuda dari komunitas marginal berdiri di antara gedung pencakar langit dan pemukiman kumuh, memegang buku dan smartphone",
            visualStyle: "cyberpunk",
            composition: ["wide-shot", "dutch-angle"],
            lighting: "neon",
            mood: ["penuh-harap", "absurd"],
            aspectRatio: "16:9",
            negativePrompt: "wajah blur, kualitas rendah, wajah cacat"
        }
    },
    {
        id: 3,
        name: "Nostalgia Buku Anak 90an",
        platform: "dalle",
        description: "Imaji masa kecil Indonesia era 90-an",
        data: {
            mainSubject: "Anak-anak bermain layangan di sawah dengan latar gunung, ilustrasi warna-warni cerah",
            visualStyle: "buku-anak-90an",
            composition: ["wide-shot"],
            lighting: "soft-box",
            mood: ["nostalgia", "sunyi"],
            aspectRatio: "4:3"
        }
    }
];

// Advanced Prompt Engine
class AdvancedPromptEngine {
    constructor(platform) {
        this.platform = platform;
        this.weights = this.getPlatformWeights(platform);
    }
    
    getPlatformWeights(platform) {
        return {
            'midjourney': { subject: 1.3, style: 1.2, composition: 1.1, lighting: 1.0, color: 0.8, mood: 0.9 },
            'stable-diffusion': { subject: 1.4, style: 1.1, composition: 1.0, lighting: 1.2, color: 0.9, mood: 0.8 },
            'dalle': { subject: 1.5, style: 1.3, composition: 0.9, lighting: 1.1, color: 0.7, mood: 1.0 },
            'universal': { subject: 1.2, style: 1.1, composition: 1.0, lighting: 1.0, color: 0.8, mood: 1.0 }
        }[platform] || { subject: 1.0, style: 1.0, composition: 1.0, lighting: 1.0, color: 1.0, mood: 1.0 };
    }
    
    applyWeighting(text, weight, platform) {
        if (!text) return '';
        
        const enableWeighting = document.getElementById('enableWeighting').checked;
        if (!enableWeighting) return text;
        
        if (platform === 'stable-diffusion') {
            return `(${text}:${weight.toFixed(1)})`;
        } else if (platform === 'midjourney' && weight > 1.0) {
            return `${text} --iw ${Math.round(weight * 2)}`;
        }
        return text;
    }
    
    enhanceSubject(subject) {
        if (!subject) return '';
        
        const enhancements = {
            'man': 'detailed face, expressive eyes, authentic emotion, natural pose',
            'woman': 'elegant features, natural expression, emotional depth, graceful posture',
            'child': 'innocent expression, playful energy, authentic childhood, curious gaze',
            'animal': 'detailed fur/feathers, natural pose, environmental integration, wildlife',
            'building': 'architectural details, texture, environmental context, structural integrity',
            'nature': 'organic forms, natural textures, environmental harmony, ecological balance'
        };
        
        let enhanced = subject;
        Object.keys(enhancements).forEach(key => {
            if (subject.toLowerCase().includes(key)) {
                enhanced += `, ${enhancements[key]}`;
            }
        });
        
        return enhanced;
    }
    
    getStyleWithArtists(style) {
        const styleArtists = {
            'studio ghibli': 'by Hayao Miyazaki, Makoto Shinkai, Ghibli style, anime aesthetic',
            'realistis': 'hyperrealistic, photorealistic, by Greg Rutkowski, realistic detail, 8K resolution',
            'cyberpunk': 'neon noir, blade runner aesthetic, by Syd Mead, futuristic, sci-fi',
            'sinematik': 'cinematic, film still, movie shot, dramatic composition, anamorphic lens',
            'batik': 'traditional Indonesian batik patterns, wayang style, cultural art, heritage',
            'buku-anak-90an': '90s Indonesian children book illustration, nostalgic, vibrant colors, retro style',
            'minimalis': 'minimalist, clean lines, simple composition, modern aesthetic'
        };
        
        return styleArtists[style] || style;
    }
    
    getAdvancedLighting(lighting) {
        const lightingMap = {
            'golden-hour': 'golden hour lighting, warm sunset glow, long shadows, golden rays, magical hour',
            'blue-hour': 'blue hour, twilight, cool tones, magical hour, serene atmosphere, dusk',
            'neon': 'neon lighting, vibrant colors, cyberpunk glow, artificial lighting, urban night',
            'chiaroscuro': 'chiaroscuro lighting, strong contrasts, dramatic shadows, baroque style, Rembrandt lighting',
            'overcast': 'soft overcast lighting, even tones, cloudy day, gentle shadows, diffused light',
            'soft-box': 'soft box lighting, professional studio, even illumination, clean lighting',
            'dramatic': 'dramatic lighting, high contrast, theatrical, spotlight, intense shadows'
        };
        
        return lightingMap[lighting] || lighting;
    }
    
    assemblePrompt(formData) {
        const {
            mainSubject,
            visualStyle,
            colorPalette,
            compositions,
            customComposition,
            lighting,
            moods,
            aspectRatio,
            modelVersion,
            negativePrompt,
            cfgScale,
            quality
        } = formData;
        
        const weightedParts = [];
        
        // 1. Enhanced Subject (Highest priority)
        if (mainSubject) {
            const enhancedSubject = this.enhanceSubject(mainSubject);
            weightedParts.push(this.applyWeighting(enhancedSubject, this.weights.subject, this.platform));
        }
        
        // 2. Visual Style
        if (visualStyle) {
            const styleWithArtists = this.getStyleWithArtists(visualStyle);
            weightedParts.push(this.applyWeighting(styleWithArtists, this.weights.style, this.platform));
        }
        
        // 3. Color Palette
        if (colorPalette && COLOR_PALETTES[colorPalette]) {
            weightedParts.push(this.applyWeighting(COLOR_PALETTES[colorPalette], this.weights.color, this.platform));
        }
        
        // 4. Composition
        let compositionText = '';
        if (compositions.length > 0) {
            compositionText += compositions.join(', ');
        }
        if (customComposition) {
            compositionText += (compositionText ? ', ' : '') + customComposition;
        }
        if (compositionText) {
            weightedParts.push(this.applyWeighting(compositionText, this.weights.composition, this.platform));
        }
        
        // 5. Lighting
        if (lighting) {
            const advancedLighting = this.getAdvancedLighting(lighting);
            weightedParts.push(this.applyWeighting(advancedLighting, this.weights.lighting, this.platform));
        }
        
        // 6. Mood
        if (moods.length > 0) {
            weightedParts.push(this.applyWeighting(moods.join(', '), this.weights.mood, this.platform));
        }
        
        // 7. Quality and technical (unweighted)
        const technicalParts = [];
        if (quality > 1) {
            technicalParts.push('high quality', 'detailed', 'sharp focus', 'masterpiece');
        } else if (quality < 1) {
            technicalParts.push('sketch', 'concept art', 'rough');
        }
        
        // Platform-specific assembly
        let finalPrompt = '';
        
        switch(this.platform) {
            case 'midjourney':
                finalPrompt = weightedParts.join(', ');
                if (technicalParts.length > 0) {
                    finalPrompt += ', ' + technicalParts.join(', ');
                }
                if (aspectRatio) {
                    finalPrompt += ` --ar ${aspectRatio}`;
                }
                if (modelVersion) {
                    finalPrompt += ` --v ${modelVersion}`;
                }
                if (cfgScale && cfgScale !== 7) {
                    finalPrompt += ` --cfg ${cfgScale}`;
                }
                break;
                
            case 'stable-diffusion':
                finalPrompt = weightedParts.join(', ');
                if (technicalParts.length > 0) {
                    finalPrompt += ', ' + technicalParts.join(', ');
                }
                if (negativePrompt) {
                    finalPrompt += `\n\nNegative prompt: ${negativePrompt}`;
                }
                if (cfgScale && cfgScale !== 7) {
                    finalPrompt += `\nCFG scale: ${cfgScale}`;
                }
                if (aspectRatio) {
                    finalPrompt += `\nSize: ${this.getDimensionsFromAspect(aspectRatio)}`;
                }
                break;
                
            case 'dalle':
                finalPrompt = weightedParts.join('. ') + '.';
                if (technicalParts.length > 0) {
                    finalPrompt += ' ' + technicalParts.join('. ') + '.';
                }
                break;
                
            default:
                finalPrompt = weightedParts.join(', ');
                if (technicalParts.length > 0) {
                    finalPrompt += ', ' + technicalParts.join(', ');
                }
        }
        
        return finalPrompt.trim();
    }
    
    getDimensionsFromAspect(aspectRatio) {
        const dimensions = {
            '1:1': '1024x1024',
            '16:9': '1280x720',
            '9:16': '720x1280',
            '4:3': '1024x768',
            '3:2': '1152x768'
        };
        return dimensions[aspectRatio] || '1024x1024';
    }
}

// Prompt Analyzer
class PromptAnalyzer {
    analyzePrompt(prompt) {
        const analysis = {
            score: 0,
            maxScore: 10,
            feedback: [],
            suggestions: []
        };
        
        if (!prompt || prompt.length < 10) {
            analysis.feedback.push({ type: 'warning', message: 'Prompt terlalu pendek' });
            return analysis;
        }
        
        // Length analysis
        if (prompt.length < 50) {
            analysis.score += 2;
            analysis.feedback.push({ type: 'warning', message: 'Prompt terlalu pendek - tambahkan lebih banyak detail' });
        } else if (prompt.length > 500) {
            analysis.score += 3;
            analysis.feedback.push({ type: 'warning', message: 'Prompt mungkin terlalu panjang - beberapa AI mungkin mengabaikan bagian akhir' });
        } else {
            analysis.score += 4;
            analysis.feedback.push({ type: 'positive', message: 'Panjang prompt optimal' });
        }
        
        // Essential elements check
        const essentialElements = ['subject', 'style', 'lighting', 'composition'];
        const hasElements = essentialElements.filter(el => 
            prompt.toLowerCase().includes(el)
        ).length;
        
        analysis.score += Math.min(hasElements, 3);
        
        if (hasElements >= 3) {
            analysis.feedback.push({ type: 'positive', message: 'Struktur prompt lengkap dengan elemen penting' });
        } else {
            analysis.suggestions.push('Tambahkan lebih banyak elemen deskriptif seperti gaya visual dan pencahayaan');
        }
        
        // Sensory details check
        const sensoryWords = ['texture', 'light', 'shadow', 'color', 'material', 'atmosphere', 'detailed', 'expression'];
        const hasSensory = sensoryWords.some(word => prompt.toLowerCase().includes(word));
        
        if (hasSensory) {
            analysis.score += 2;
            analysis.feedback.push({ type: 'positive', message: 'Prompt mengandung detail sensorik yang baik' });
        } else {
            analysis.score += 1;
            analysis.suggestions.push('Tambahkan detail sensorik seperti tekstur, material, dan ekspresi');
        }
        
        // Quality keywords check
        const qualityWords = ['high quality', 'detailed', 'sharp', 'masterpiece', 'best quality'];
        const hasQuality = qualityWords.some(word => prompt.toLowerCase().includes(word));
        
        if (hasQuality) {
            analysis.score += 1;
            analysis.feedback.push({ type: 'positive', message: 'Mengandung kata kunci kualitas' });
        } else {
            analysis.suggestions.push('Pertimbangkan menambahkan kata kunci kualitas seperti "high quality" atau "detailed"');
        }
        
        // Ensure score doesn't exceed max
        analysis.score = Math.min(analysis.score, analysis.maxScore);
        
        return analysis;
    }
    
    getScoreColor(score) {
        if (score >= 8) return '#10b981'; // hijau
        if (score >= 6) return '#f59e0b'; // kuning
        return '#ef4444'; // merah
    }
}

// Variations Generator
class VariationsGenerator {
    generateVariations(basePrompt, count = 3) {
        const variations = [];
        const platform = document.getElementById('platformSelect').value;
        
        for (let i = 0; i < count; i++) {
            let variation = basePrompt;
            
            // Style variations
            const styles = {
                'cinematic': 'cinematic, film still, dramatic lighting, anamorphic lens',
                'painterly': 'painterly style, brush strokes, oil painting, artistic',
                'illustration': 'digital illustration, concept art, vibrant colors',
                'minimalist': 'minimalist, clean composition, simple background'
            };
            
            // Lighting variations
            const lightings = {
                'dramatic': 'dramatic lighting, high contrast, cinematic shadows',
                'soft': 'soft lighting, gentle shadows, even illumination',
                'moody': 'moody lighting, atmospheric, emotional lighting',
                'natural': 'natural lighting, sunlight, outdoor illumination'
            };
            
            // Apply random variations
            if (Math.random() > 0.5) {
                const randomStyle = this.randomChoice(Object.values(styles));
                variation = variation.replace(/style:.*?(,|$)/, `style: ${randomStyle}$1`);
            }
            
            if (Math.random() > 0.5) {
                const randomLighting = this.randomChoice(Object.values(lightings));
                variation = variation.replace(/lighting:.*?(,|$)/, `lighting: ${randomLighting}$1`);
            }
            
            // Add random quality descriptors
            const descriptors = ['highly detailed', 'intricate', 'professional', 'award winning'];
            if (Math.random() > 0.7) {
                variation += ', ' + this.randomChoice(descriptors);
            }
            
            variations.push({
                prompt: variation,
                id: Date.now() + i,
                platform: platform
            });
        }
        
        return variations;
    }
    
    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

// Smart History Manager
class SmartHistory {
    constructor() {
        this.history = JSON.parse(localStorage.getItem('promptforge_history')) || [];
        this.favorites = JSON.parse(localStorage.getItem('promptforge_favorites')) || [];
    }
    
    saveToHistory(prompt, platform, parameters = {}) {
        const entry = {
            id: Date.now(),
            prompt,
            platform,
            parameters,
            timestamp: new Date().toISOString(),
            usageCount: 1,
            isFavorite: false
        };
        
        // Check for duplicates (similar prompts)
        const existingIndex = this.history.findIndex(item => 
            item.prompt === prompt && item.platform === platform
        );
        
        if (existingIndex !== -1) {
            this.history[existingIndex].usageCount++;
            this.history[existingIndex].timestamp = entry.timestamp;
        } else {
            this.history.unshift(entry);
            // Keep only last 100 items
            this.history = this.history.slice(0, 100);
        }
        
        this.saveToStorage();
        this.updateStats();
    }
    
    addToFavorites(entry) {
        if (!this.favorites.find(fav => fav.id === entry.id)) {
            entry.isFavorite = true;
            this.favorites.unshift(entry);
            this.saveToStorage();
            this.updateStats();
            return true;
        }
        return false;
    }
    
    removeFromFavorites(entryId) {
        this.favorites = this.favorites.filter(fav => fav.id !== entryId);
        // Also update in history
        const historyEntry = this.history.find(item => item.id === entryId);
        if (historyEntry) {
            historyEntry.isFavorite = false;
        }
        this.saveToStorage();
        this.updateStats();
    }
    
    clearHistory() {
        this.history = [];
        this.favorites = [];
        this.saveToStorage();
        this.updateStats();
    }
    
    saveToStorage() {
        localStorage.setItem('promptforge_history', JSON.stringify(this.history));
        localStorage.setItem('promptforge_favorites', JSON.stringify(this.favorites));
    }
    
    getStats() {
        const platformCounts = {};
        this.history.forEach(entry => {
            platformCounts[entry.platform] = (platformCounts[entry.platform] || 0) + 1;
        });
        
        const mostUsedPlatform = Object.keys(platformCounts).reduce((a, b) => 
            platformCounts[a] > platformCounts[b] ? a : b, 'None'
        );
        
        const totalLength = this.history.reduce((sum, entry) => sum + entry.prompt.length, 0);
        const averageLength = this.history.length > 0 ? Math.round(totalLength / this.history.length) : 0;
        
        return {
            totalPrompts: this.history.length,
            favoriteCount: this.favorites.length,
            mostUsedPlatform: mostUsedPlatform,
            averagePromptLength: averageLength
        };
    }
    
    updateStats() {
        const stats = this.getStats();
        
        document.getElementById('totalPrompts').textContent = stats.totalPrompts;
        document.getElementById('favoriteCount').textContent = stats.favoriteCount;
        document.getElementById('topPlatform').textContent = stats.mostUsedPlatform;
        
        return stats;
    }
}

// DOM Elements
const platformSelect = document.getElementById('platformSelect');
const mainSubject = document.getElementById('mainSubject');
const visualStyle = document.getElementById('visualStyle');
const customStyle = document.getElementById('customStyle');
const colorPalette = document.getElementById('colorPalette');
const compositionCheckboxes = document.querySelectorAll('input[type="checkbox"]');
const customComposition = document.getElementById('customComposition');
const lighting = document.getElementById('lighting');
const moodTags = document.querySelectorAll('.tag');
const aspectRatio = document.getElementById('aspectRatio');
const modelVersion = document.getElementById('modelVersion');
const negativePromptGroup = document.getElementById('negativePromptGroup');
const negativePrompt = document.getElementById('negativePrompt');
const templateSelect = document.getElementById('templateSelect');
const loadTemplateBtn = document.getElementById('loadTemplate');
const finalPrompt = document.getElementById('finalPrompt');
const optimizeBtn = document.getElementById('optimizeBtn');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');

// Advanced parameters
const cfgScale = document.getElementById('cfgScale');
const cfgValue = document.getElementById('cfgValue');
const quality = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const enableWeighting = document.getElementById('enableWeighting');
const enableBlending = document.getElementById('enableBlending');

// Variations
const generateVariationsBtn = document.getElementById('generateVariationsBtn');
const variationsCount = document.getElementById('variationsCount');
const variationsContainer = document.getElementById('variationsContainer');

// History & Analytics
const saveToHistoryBtn = document.getElementById('saveToHistoryBtn');
const saveToFavoritesBtn = document.getElementById('saveToFavoritesBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const historyList = document.getElementById('historyList');
const scoreCircle = document.getElementById('scoreCircle');
const scoreValue = document.getElementById('scoreValue');
const analyticsFeedback = document.getElementById('analyticsFeedback');
const platformBadge = document.getElementById('platformBadge');
const promptLength = document.getElementById('promptLength');

// Tabs
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanes = document.querySelectorAll('.tab-pane');
const historyTabs = document.querySelectorAll('.history-tab');

// Initialize classes
const promptAnalyzer = new PromptAnalyzer();
const variationsGenerator = new VariationsGenerator();
const smartHistory = new SmartHistory();

// Current state
let currentPrompt = '';
let currentVariations = [];

// Initialize application
function init() {
    loadTemplates();
    setupEventListeners();
    updateUI();
    generatePrompt();
    smartHistory.updateStats();
    loadHistory('recent');
}

// Load templates into dropdown
function loadTemplates() {
    TEMPLATES.forEach(template => {
        const option = document.createElement('option');
        option.value = template.id;
        option.textContent = `${template.name} (${template.platform})`;
        templateSelect.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Platform and form changes
    platformSelect.addEventListener('change', updateUI);
    visualStyle.addEventListener('change', toggleCustomStyle);
    compositionCheckboxes.forEach(cb => cb.addEventListener('change', generatePrompt));
    moodTags.forEach(tag => tag.addEventListener('click', toggleMoodTag));
    
    // Real-time prompt generation
    const realTimeElements = [mainSubject, customStyle, customComposition, lighting, aspectRatio, modelVersion, negativePrompt, colorPalette];
    realTimeElements.forEach(element => element.addEventListener('input', generatePrompt));
    
    // Advanced parameters
    cfgScale.addEventListener('input', updateCfgValue);
    quality.addEventListener('input', updateQualityValue);
    enableWeighting.addEventListener('change', generatePrompt);
    enableBlending.addEventListener('change', generatePrompt);
    
    // Template and actions
    loadTemplateBtn.addEventListener('click', loadSelectedTemplate);
    optimizeBtn.addEventListener('click', optimizePrompt);
    copyBtn.addEventListener('click', copyToClipboard);
    downloadBtn.addEventListener('click', downloadPrompt);
    
    // Variations
    generateVariationsBtn.addEventListener('click', generateVariationsHandler);
    
    // History
    saveToHistoryBtn.addEventListener('click', saveToHistory);
    saveToFavoritesBtn.addEventListener('click', saveToFavorites);
    clearHistoryBtn.addEventListener('click', clearHistory);
    
    // Tabs
    tabButtons.forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });
    
    historyTabs.forEach(tab => {
        tab.addEventListener('click', () => switchHistoryTab(tab.dataset.history));
    });
}

// Update UI based on platform selection
function updateUI() {
    const platform = platformSelect.value;
    const config = PLATFORM_CONFIG[platform];
    
    // Show/hide negative prompt
    negativePromptGroup.style.display = config.negativePrompt ? 'block' : 'none';
    
    // Update platform badge
    platformBadge.textContent = config.name;
    
    generatePrompt();
}

// Update slider values
function updateCfgValue() {
    cfgValue.textContent = cfgScale.value;
    generatePrompt();
}

function updateQualityValue() {
    qualityValue.textContent = quality.value;
    generatePrompt();
}

// Toggle custom style input
function toggleCustomStyle() {
    customStyle.style.display = visualStyle.value === 'custom' ? 'block' : 'none';
    generatePrompt();
}

// Toggle mood tag selection
function toggleMoodTag(event) {
    event.target.classList.toggle('selected');
    generatePrompt();
}

// Switch main tabs
function switchTab(tabName) {
    // Update tab buttons
    tabButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.tab === tabName);
    });
    
    // Update tab panes
    tabPanes.forEach(pane => {
        pane.classList.toggle('active', pane.id === tabName);
    });
    
    // Refresh analytics if switching to history tab
    if (tabName === 'history') {
        updateAnalytics();
    }
}

// Switch history tabs
function switchHistoryTab(historyType) {
    historyTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.history === historyType);
    });
    
    loadHistory(historyType);
}

// Load selected template
function loadSelectedTemplate() {
    const templateId = parseInt(templateSelect.value);
    if (!templateId) return;
    
    const template = TEMPLATES.find(t => t.id === templateId);
    if (!template) return;
    
    // Fill form with template data
    const data = template.data;
    
    mainSubject.value = data.mainSubject || '';
    visualStyle.value = data.visualStyle || '';
    customComposition.value = data.customComposition || '';
    lighting.value = data.lighting || '';
    aspectRatio.value = data.aspectRatio || '';
    negativePrompt.value = data.negativePrompt || '';
    colorPalette.value = data.colorPalette || '';
    
    // Reset checkboxes
    compositionCheckboxes.forEach(cb => cb.checked = false);
    
    // Set composition checkboxes
    if (data.composition) {
        data.composition.forEach(comp => {
            const checkbox = document.querySelector(`input[value="${comp}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
    
    // Reset mood tags
    moodTags.forEach(tag => tag.classList.remove('selected'));
    
    // Set mood tags
    if (data.mood) {
        data.mood.forEach(mood => {
            const tag = document.querySelector(`.tag[data-value="${mood}"]`);
            if (tag) tag.classList.add('selected');
        });
    }
    
    // Set platform if different
    if (template.platform !== platformSelect.value) {
        platformSelect.value = template.platform;
        updateUI();
    }
    
    generatePrompt();
}

// Generate final prompt
function generatePrompt() {
    const platform = platformSelect.value;
    
    // Collect form data
    const formData = {
        mainSubject: mainSubject.value,
        visualStyle: visualStyle.value === 'custom' ? customStyle.value : visualStyle.value,
        colorPalette: colorPalette.value,
        compositions: Array.from(compositionCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value),
        customComposition: customComposition.value,
        lighting: lighting.value,
        moods: Array.from(moodTags)
            .filter(tag => tag.classList.contains('selected'))
            .map(tag => tag.textContent),
        aspectRatio: aspectRatio.value,
        modelVersion: modelVersion.value,
        negativePrompt: negativePrompt.value,
        cfgScale: parseFloat(cfgScale.value),
        quality: parseFloat(quality.value)
    };
    
    // Use advanced prompt engine
    const promptEngine = new AdvancedPromptEngine(platform);
    currentPrompt = promptEngine.assemblePrompt(formData);
    
    // Display final prompt
    finalPrompt.textContent = currentPrompt;
    
    // Update prompt length
    promptLength.textContent = `${currentPrompt.length} chars`;
    
    // Add syntax highlighting
    highlightSyntax(currentPrompt, platform);
    
    // Update analytics
    updateAnalytics();
}

// Syntax highlighting
function highlightSyntax(prompt, platform) {
    // Simple keyword highlighting
    const keywords = ['Gaya', 'Komposisi', 'Pencahayaan', 'Mood', 'Negative prompt', 'CFG scale', 'Size'];
    let highlighted = prompt;
    
    keywords.forEach(keyword => {
        const regex = new RegExp(`(${keyword}:?)`, 'gi');
        highlighted = highlighted.replace(regex, '<strong>$1</strong>');
    });
    
    // Platform-specific highlighting
    if (platform === 'midjourney') {
        highlighted = highlighted.replace(/(--\w+ \S+)/g, '<span style="color: #e53e3e;">$1</span>');
    }
    
    if (platform === 'stable-diffusion') {
        highlighted = highlighted.replace(/(Negative prompt:.*)/g, '<span style="color: #e53e3e;">$1</span>');
    }
    
    finalPrompt.innerHTML = highlighted;
}

// Update analytics display
function updateAnalytics() {
    const analysis = promptAnalyzer.analyzePrompt(currentPrompt);
    
    // Update score
    scoreValue.textContent = analysis.score;
    scoreCircle.style.background = promptAnalyzer.getScoreColor(analysis.score);
    scoreCircle.style.color = analysis.score >= 6 ? 'white' : '#2d3748';
    
    // Update feedback
    analyticsFeedback.innerHTML = '';
    
    if (analysis.feedback.length === 0) {
        analyticsFeedback.innerHTML = '<p>Masukkan prompt untuk melihat analisis</p>';
        return;
    }
    
    analysis.feedback.forEach(feedback => {
        const div = document.createElement('div');
        div.className = `feedback-item feedback-${feedback.type === 'positive' ? 'positive' : 'warning'}`;
        div.textContent = feedback.message;
        analyticsFeedback.appendChild(div);
    });
    
    if (analysis.suggestions.length > 0) {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'feedback-item feedback-suggestion';
        suggestionDiv.innerHTML = '<strong>Saran:</strong><br>' + analysis.suggestions.join('<br>');
        analyticsFeedback.appendChild(suggestionDiv);
    }
}

// Optimize button handler
function optimizePrompt() {
    generatePrompt();
    
    // Show optimization message
    const originalContent = finalPrompt.textContent;
    finalPrompt.innerHTML = `✅ Dioptimalkan untuk <strong>${PLATFORM_CONFIG[platformSelect.value].name}</strong>\n\n${finalPrompt.innerHTML}`;
    
    setTimeout(() => {
        finalPrompt.textContent = originalContent;
        highlightSyntax(originalContent, platformSelect.value);
    }, 3000);
}

// Generate variations
function generateVariationsHandler() {
    const count = parseInt(variationsCount.value);
    currentVariations = variationsGenerator.generateVariations(currentPrompt, count);
    
    displayVariations(currentVariations);
}

// Display variations
function displayVariations(variations) {
    variationsContainer.innerHTML = '';
    
    if (variations.length === 0) {
        variationsContainer.innerHTML = '<p class="placeholder">Tidak ada variasi yang dihasilkan</p>';
        return;
    }
    
    variations.forEach((variation, index) => {
        const variationDiv = document.createElement('div');
        variationDiv.className = 'variation-item';
        variationDiv.innerHTML = `
            <div class="variation-prompt">${variation.prompt}</div>
            <div class="variation-meta">Variation ${index + 1}</div>
        `;
        
        variationDiv.addEventListener('click', () => {
            // Use this variation as current prompt
            currentPrompt = variation.prompt;
            finalPrompt.textContent = currentPrompt;
            highlightSyntax(currentPrompt, variation.platform);
            updateAnalytics();
            
            // Switch back to builder tab
            switchTab('builder');
        });
        
        variationsContainer.appendChild(variationDiv);
    });
}

// Save to history
function saveToHistory() {
    if (!currentPrompt) {
        alert('Tidak ada prompt untuk disimpan');
        return;
    }
    
    const parameters = {
        mainSubject: mainSubject.value,
        visualStyle: visualStyle.value,
        colorPalette: colorPalette.value,
        lighting: lighting.value,
        aspectRatio: aspectRatio.value
    };
    
    smartHistory.saveToHistory(currentPrompt, platformSelect.value, parameters);
    loadHistory('recent');
    
    // Show confirmation
    const originalText = saveToHistoryBtn.textContent;
    saveToHistoryBtn.textContent = '✅ Tersimpan!';
    setTimeout(() => {
        saveToHistoryBtn.textContent = originalText;
    }, 2000);
}

// Save to favorites
function saveToFavorites() {
    if (!currentPrompt) {
        alert('Tidak ada prompt untuk disimpan');
        return;
    }
    
    const entry = {
        id: Date.now(),
        prompt: currentPrompt,
        platform: platformSelect.value,
        parameters: {
            mainSubject: mainSubject.value,
            visualStyle: visualStyle.value,
            colorPalette: colorPalette.value
        },
        timestamp: new Date().toISOString(),
        isFavorite: true
    };
    
    if (smartHistory.addToFavorites(entry)) {
        loadHistory('favorites');
        
        // Show confirmation
        const originalText = saveToFavoritesBtn.textContent;
        saveToFavoritesBtn.textContent = '⭐ Ditambahkan!';
        setTimeout(() => {
            saveToFavoritesBtn.textContent = originalText;
        }, 2000);
    } else {
        alert('Prompt sudah ada di favorit');
    }
}

// Clear history
function clearHistory() {
    if (confirm('Apakah Anda yakin ingin menghapus semua riwayat?')) {
        smartHistory.clearHistory();
        loadHistory('recent');
    }
}

// Load history
function loadHistory(type) {
    historyList.innerHTML = '';
    
    const items = type === 'favorites' ? smartHistory.favorites : smartHistory.history;
    
    if (items.length === 0) {
        historyList.innerHTML = `<p class="placeholder">${type === 'favorites' ? 'Belum ada favorit' : 'Belum ada riwayat'}</p>`;
        return;
    }
    
    items.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = `history-item ${item.isFavorite ? 'favorite' : ''}`;
        historyItem.innerHTML = `
            <div class="history-prompt">${item.prompt}</div>
            <div class="history-meta">
                <span>${PLATFORM_CONFIG[item.platform]?.name || 'Unknown'}</span>
                <span>${new Date(item.timestamp).toLocaleDateString('id-ID')}</span>
            </div>
            ${item.isFavorite ? `
            <div class="history-actions">
                <button class="remove-favorite" data-id="${item.id}">Hapus dari Favorit</button>
            </div>
            ` : ''}
        `;
        
        // Load prompt when clicked
        historyItem.addEventListener('click', (e) => {
            if (!e.target.classList.contains('remove-favorite')) {
                currentPrompt = item.prompt;
                finalPrompt.textContent = currentPrompt;
                highlightSyntax(currentPrompt, item.platform);
                
                // Set platform
                platformSelect.value = item.platform;
                updateUI();
                
                // Switch to builder tab
                switchTab('builder');
                
                updateAnalytics();
            }
        });
        
        // Remove from favorites
        const removeBtn = historyItem.querySelector('.remove-favorite');
        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                smartHistory.removeFromFavorites(item.id);
                loadHistory('favorites');
            });
        }
        
        historyList.appendChild(historyItem);
    });
}

// Copy to clipboard
async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(finalPrompt.textContent);
        
        // Visual feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Disalin!';
        copyBtn.style.background = '#48bb78';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy: ', err);
        alert('Gagal menyalin ke clipboard');
    }
}

// Download prompt as text file
function downloadPrompt() {
    const promptText = finalPrompt.textContent;
    const platform = PLATFORM_CONFIG[platformSelect.value].name;
    const filename = `promptforge-${platform.toLowerCase()}-${Date.now()}.txt`;
    
    const blob = new Blob([promptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
