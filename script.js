// Platform configuration
const PLATFORM_CONFIG = {
    'universal': { name: 'Universal', negativePrompt: false, parameters: true },
    'dalle': { name: 'DALL·E', negativePrompt: false, parameters: false },
    'midjourney': { name: 'Midjourney', negativePrompt: false, parameters: true },
    'stable-diffusion': { name: 'Stable Diffusion', negativePrompt: true, parameters: true },
    'gemini': { name: 'Gemini', negativePrompt: false, parameters: false },
    'qwen': { name: 'Qwen', negativePrompt: false, parameters: false }
};

// Template data (in real implementation, this would be in templates.json)
const TEMPLATES = [
    {
        id: 1,
        name: "Warung Kopi Filosofis",
        platform: "universal",
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
        name: "Transformasi Sosial",
        platform: "midjourney",
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
        name: "Imaji Buku Anak 90an",
        platform: "dalle",
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

// DOM Elements
const platformSelect = document.getElementById('platformSelect');
const mainSubject = document.getElementById('mainSubject');
const visualStyle = document.getElementById('visualStyle');
const customStyle = document.getElementById('customStyle');
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

// Initialize application
function init() {
    loadTemplates();
    setupEventListeners();
    updateUI();
    generatePrompt();
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
    platformSelect.addEventListener('change', updateUI);
    visualStyle.addEventListener('change', toggleCustomStyle);
    compositionCheckboxes.forEach(cb => cb.addEventListener('change', generatePrompt));
    moodTags.forEach(tag => tag.addEventListener('click', toggleMoodTag));
    
    // Real-time prompt generation
    [mainSubject, customStyle, customComposition, lighting, aspectRatio, modelVersion, negativePrompt]
        .forEach(element => element.addEventListener('input', generatePrompt));
    
    loadTemplateBtn.addEventListener('click', loadSelectedTemplate);
    optimizeBtn.addEventListener('click', optimizePrompt);
    copyBtn.addEventListener('click', copyToClipboard);
    downloadBtn.addEventListener('click', downloadPrompt);
}

// Update UI based on platform selection
function updateUI() {
    const platform = platformSelect.value;
    const config = PLATFORM_CONFIG[platform];
    
    // Show/hide negative prompt
    negativePromptGroup.style.display = config.negativePrompt ? 'block' : 'none';
    
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
    const config = PLATFORM_CONFIG[platform];
    
    let prompt = '';
    
    // Main subject (always included)
    if (mainSubject.value) {
        prompt += mainSubject.value + '. ';
    }
    
    // Visual style
    const style = visualStyle.value === 'custom' ? customStyle.value : visualStyle.value;
    if (style) {
        prompt += `Gaya ${style}. `;
    }
    
    // Composition
    const compositions = Array.from(compositionCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    if (compositions.length > 0) {
        prompt += `Komposisi: ${compositions.join(', ')}. `;
    }
    
    if (customComposition.value) {
        prompt += `${customComposition.value}. `;
    }
    
    // Lighting
    if (lighting.value) {
        prompt += `Pencahayaan: ${lighting.options[lighting.selectedIndex].text}. `;
    }
    
    // Mood
    const selectedMoods = Array.from(moodTags)
        .filter(tag => tag.classList.contains('selected'))
        .map(tag => tag.textContent);
    
    if (selectedMoods.length > 0) {
        prompt += `Mood: ${selectedMoods.join(', ')}. `;
    }
    
    // Platform-specific formatting
    prompt = optimizeForPlatform(prompt, platform);
    
    // Display final prompt
    finalPrompt.textContent = prompt;
    
    // Add syntax highlighting for specific platforms
    highlightSyntax(prompt, platform);
}

// Optimize prompt for specific platform
function optimizeForPlatform(prompt, platform) {
    let optimized = prompt;
    
    switch (platform) {
        case 'midjourney':
            // Add parameters for Midjourney
            let params = '';
            if (aspectRatio.value) {
                params += ` --ar ${aspectRatio.value}`;
            }
            if (modelVersion.value) {
                params += ` --v ${modelVersion.value}`;
            }
            optimized += params;
            break;
            
        case 'stable-diffusion':
            // Stable Diffusion often uses emphasis with parentheses
            optimized = optimized.replace(/\. /g, ', ');
            if (negativePrompt.value) {
                optimized += `\n\nNegative Prompt: ${negativePrompt.value}`;
            }
            break;
            
        case 'dalle':
            // DALL·E prefers natural language
            // No special formatting needed
            break;
    }
    
    return optimized.trim();
}

// Syntax highlighting
function highlightSyntax(prompt, platform) {
    // Simple keyword highlighting
    const keywords = ['Gaya', 'Komposisi', 'Pencahayaan', 'Mood', 'Negative Prompt'];
    let highlighted = prompt;
    
    keywords.forEach(keyword => {
        const regex = new RegExp(`(${keyword}:?)`, 'gi');
        highlighted = highlighted.replace(regex, '<strong>$1</strong>');
    });
    
    // Platform-specific highlighting
    if (platform === 'midjourney') {
        highlighted = highlighted.replace(/(--\w+ \S+)/g, '<span style="color: #e53e3e;">$1</span>');
    }
    
    finalPrompt.innerHTML = highlighted;
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
