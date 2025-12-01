# 🎨 Theme Customization Guide

Complete guide untuk customize theme di NeoShell!

---

## ✨ New Features Added

### 1. 📐 **Sidebar Toggle**
- Hide/show sidebar dengan one-click
- Save preference otomatis
- Smooth slide animation
- Button accessible di top-left

### 2. 🎨 **Theme System**
- 6 preset themes siap pakai
- Custom theme builder
- Save preference
- Real-time preview

---

## 🎯 How to Use

### Toggle Sidebar

**Click button** di top-left corner (☰ atau ✕)
- Click once → Sidebar hidden
- Click again → Sidebar shown
- Preference saved otomatis

**Benefits:**
- ✅ More screen space
- ✅ Focus mode
- ✅ Cleaner workspace

---

## 🎨 Preset Themes

### 1. **Purple Galaxy** (Default)
```
Primary: Purple (#667eea)
Secondary: Deep Purple (#764ba2)
Vibe: Modern, professional
```

### 2. **Ocean Blue**
```
Primary: Navy (#2E3192)
Secondary: Cyan (#1BFFFF)
Vibe: Cool, refreshing
```

### 3. **Sunset Glow**
```
Primary: Red (#FF6B6B)
Secondary: Yellow (#FFE66D)
Vibe: Warm, energetic
```

### 4. **Forest Green**
```
Primary: Teal (#134E5E)
Secondary: Green (#71B280)
Vibe: Natural, calm
```

### 5. **Midnight**
```
Primary: Dark Blue (#0F2027)
Secondary: Steel (#2C5364)
Vibe: Professional, sleek
```

### 6. **Candy Pop**
```
Primary: Orange (#D38312)
Secondary: Magenta (#A83279)
Vibe: Vibrant, playful
```

---

## 🛠️ How to Change Theme

### Option 1: Preset Theme

1. Click **🎨 button** (bottom-right corner)
2. Choose from 6 presets
3. Click theme → Applied instantly!
4. Theme saved automatically

### Option 2: Custom Theme

1. Click **🎨 button**
2. Scroll to "Custom Theme" section
3. Pick colors:
   - **Primary**: Main accent color
   - **Secondary**: Gradient color
   - **Background**: Main background
4. Click **"Apply Custom"**
5. Done! Your custom theme is active

---

## 🎨 Theme Preview

### Purple Galaxy (Default)
```
┌─────────────────────────┐
│ 💜 Purple gradient      │
│ Professional & modern   │
│ Best for: All use cases │
└─────────────────────────┘
```

### Ocean Blue
```
┌─────────────────────────┐
│ 🌊 Blue to cyan         │
│ Cool & refreshing       │
│ Best for: Focus work    │
└─────────────────────────┘
```

### Sunset Glow
```
┌─────────────────────────┐
│ 🌅 Red to yellow        │
│ Warm & energetic        │
│ Best for: Creative work │
└─────────────────────────┘
```

### Forest Green
```
┌─────────────────────────┐
│ 🌲 Teal to green        │
│ Natural & calm          │
│ Best for: Long sessions │
└─────────────────────────┘
```

### Midnight
```
┌─────────────────────────┐
│ 🌙 Dark blue to steel   │
│ Professional & sleek    │
│ Best for: Night work    │
└─────────────────────────┘
```

### Candy Pop
```
┌─────────────────────────┐
│ 🍬 Orange to magenta    │
│ Vibrant & playful       │
│ Best for: Fun projects  │
└─────────────────────────┘
```

---

## 🎯 Custom Theme Builder

### Step-by-Step

1. **Open Theme Menu**
   - Click 🎨 button (bottom-right)

2. **Choose Primary Color**
   - Click color picker under "Primary"
   - Select your main color
   - This will be used for buttons, highlights

3. **Choose Secondary Color**
   - Click color picker under "Secondary"
   - Select gradient end color
   - Creates smooth gradient with primary

4. **Choose Background**
   - Click color picker under "Background"
   - Select main background color
   - Darker = less eye strain

5. **Apply**
   - Click "Apply Custom" button
   - Theme applied instantly!
   - Saved automatically

---

## 💡 Color Picking Tips

### For Primary Color:
- **Blue** → Professional, trustworthy
- **Purple** → Creative, modern
- **Green** → Calm, natural
- **Red** → Energetic, bold
- **Orange** → Friendly, warm

### For Background:
- **Very Dark** (#000000-#1a1a1a) → Minimal eye strain
- **Dark** (#1a1a1a-#2a2a2a) → Balanced
- **Medium** (#2a2a2a-#3a3a3a) → More contrast

### Gradient Tips:
- **Complementary colors** → High contrast
- **Analogous colors** → Smooth blend
- **Monochromatic** → Professional

---

## 🎨 Theme Inspiration

### Professional Themes
```
Primary: #0066ff (Blue)
Secondary: #00ccff (Light Blue)
Background: #0a0a0f (Very Dark)
Use: Business, corporate
```

### Creative Themes
```
Primary: #ff006e (Hot Pink)
Secondary: #8338ec (Purple)
Background: #1a0a14 (Dark Purple)
Use: Design work, creative
```

### Hacker Themes
```
Primary: #00ff41 (Matrix Green)
Secondary: #00cc33 (Dark Green)
Background: #000000 (Black)
Use: Coding, hacking
```

### Minimal Themes
```
Primary: #ffffff (White)
Secondary: #cccccc (Light Gray)
Background: #000000 (Black)
Use: Focus, minimal
```

---

## 🔧 Advanced Customization

### Sidebar Width (CSS)
Edit `styles.css`:
```css
:root {
  --sidebar-width: 300px; /* Change this */
}
```

### Custom Gradients
In theme menu, pick:
- Primary: Start color
- Secondary: End color
- Auto-generates: `linear-gradient(135deg, primary, secondary)`

### Animation Speed
Edit `styles.css`:
```css
.sidebar {
  transition: transform 0.3s ease; /* Change 0.3s */
}
```

---

## 📝 Saved Preferences

### What's Saved:
- ✅ Sidebar state (collapsed/expanded)
- ✅ Active theme name
- ✅ Custom theme colors
- ✅ All preferences persist

### Where Saved:
- **Browser LocalStorage**
- Automatic save on change
- Loaded on app start

### Clear Preferences:
```javascript
// In browser console (DevTools)
localStorage.clear();
```
Then refresh app.

---

## 🎯 Quick Reference

### Theme Menu
| Action | How |
|--------|-----|
| Open menu | Click 🎨 button |
| Apply preset | Click theme card |
| Custom theme | Use color pickers → Apply |
| Close menu | Click outside or 🎨 again |

### Sidebar
| Action | How |
|--------|-----|
| Toggle | Click ☰/✕ button |
| Show | Click when hidden |
| Hide | Click when shown |

---

## 🐛 Troubleshooting

### Theme Not Saving
**Problem**: Theme resets on restart

**Solution**:
- Check browser LocalStorage enabled
- Try different theme first
- Clear cache and try again

### Colors Look Wrong
**Problem**: Theme colors not applying

**Solution**:
- Refresh app
- Re-apply theme
- Try different theme first

### Sidebar Stuck
**Problem**: Sidebar won't hide/show

**Solution**:
- Refresh app
- Clear LocalStorage
- Check browser console for errors

---

## 💡 Pro Tips

### Tip 1: Match Your Setup
- Dark room? → Midnight or Forest theme
- Bright room? → Ocean or Sunset theme

### Tip 2: Eye Strain
- Long sessions? → Dark background (#000-#1a1a1a)
- High contrast? → Use complementary colors

### Tip 3: Productivity
- Focus work? → Hide sidebar
- Switch servers? → Show sidebar

### Tip 4: Branding
- Custom theme? → Match company colors
- Personal? → Match your style

### Tip 5: Save Multiple
- Can't save multiple customs yet
- Screenshot custom colors
- Or note down hex codes

---

## 🎨 Color Codes Reference

### Popular Gradients
```
Sunset:     #FF6B6B → #FFE66D
Ocean:      #2E3192 → #1BFFFF
Forest:     #134E5E → #71B280
Fire:       #F85032 → #E73827
Sky:        #00d2ff → #3a7bd5
Grape:      #667eea → #764ba2
```

### Background Codes
```
Black:      #000000
Dark:       #0a0a0f
Medium:     #1a1a2e
Light:      #2a2a3e
```

---

## 📊 Theme Comparison

| Theme | Brightness | Contrast | Energy | Professional |
|-------|-----------|----------|--------|--------------|
| Purple Galaxy | ●●●○○ | ●●●○○ | ●●●○○ | ●●●●● |
| Ocean Blue | ●●○○○ | ●●●●○ | ●●○○○ | ●●●●○ |
| Sunset Glow | ●●●●○ | ●●●●● | ●●●●● | ●●○○○ |
| Forest Green | ●●○○○ | ●●●○○ | ●●○○○ | ●●●●○ |
| Midnight | ●○○○○ | ●●○○○ | ●●○○○ | ●●●●● |
| Candy Pop | ●●●●○ | ●●●●● | ●●●●● | ●●○○○ |

---

## 🎉 Enjoy Your Custom Theme!

NeoShell now adapts to YOUR style! 

Questions? Check [README.md](README.md) or [GitHub Issues](https://github.com/adriyansyah-mf/NeoShell/issues)

---

Made with ❤️ by [Adriyansyah MF](https://github.com/adriyansyah-mf)

