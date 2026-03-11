/**
 * Sid Bot - AI Chatbot Widget
 * Portfolio: CodewithSid
 * Author: Saad Saeed
 * Version: 2.0
 * 
 * An enhanced AI-powered chatbot with scoring-based intent detection,
 * dynamic knowledge integration, typing animations, and smart context memory.
 */

(function() {
  'use strict';

  // ========================================
  // CONFIGURATION
  // ========================================
  
  const CONFIG = {
    botName: 'Sid Bot',
    botSubtitle: 'Ask me anything about Saad 👋',
    botAvatar: '🤖',
    botAvatarImage: 'img/avatars/AI_bot.jpeg',
    storageKey: 'sidbot_chat_history',
    contextKey: 'sidbot_context',
    typingDelay: 800,
    charTypingSpeed: 15, // ms per character for typing effect
    maxHistory: 50,
    minIntentScore: 1.5, // minimum score to consider a match
    analyticsEnabled: true
  };

  // ========================================
  // KNOWLEDGE BASE - Dynamic Information
  // ========================================
  
  const KNOWLEDGE = {
    name: 'Saad Saeed',
    fullName: 'Muhammad Saad Saeed',
    title: 'Full-Stack Developer & UI/UX Specialist',
    skills: {
      frontend: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap'],
      backend: ['Node.js', 'Express', 'MongoDB', 'MySQL'],
      design: ['Figma', 'Photoshop', 'UI/UX Design'],
      other: ['Git', 'WordPress', 'Shopify', 'Elementor']
    },
    services: [
      { name: 'Full-Stack Development', icon: '🌐', desc: 'React, Next.js, Node.js, MongoDB' },
      { name: 'UI/UX Design', icon: '🎨', desc: 'Figma, Photoshop, User-centered design' },
      { name: 'Website Maintenance', icon: '🔧', desc: 'Updates, optimization, support' },
      { name: 'Brand Identity', icon: '🎯', desc: 'Logo design, style guides' },
      { name: 'Freelance Consulting', icon: '💼', desc: 'Project planning, tech advice' }
    ],
    socials: {
      github: { url: 'https://github.com/SAADSAEED007', label: 'GitHub', icon: '💻' },
      whatsapp: { url: 'https://wa.me/923142990250?text=Hello! I would like to connect.', label: 'WhatsApp', icon: '💬' },
      instagram: { url: 'https://www.instagram.com/codewith_sid', label: 'Instagram', icon: '📷' },
      twitch: { url: 'https://www.twitch.tv/codewithsid', label: 'Twitch', icon: '🎮' },
      linkedin: { url: '#', label: 'LinkedIn', icon: '💼' }
    },
    contact: {
      email: 'codewithsid1@gmail.com',
      phone: '+92 314-299-0250',
      location: 'Karachi, Pakistan',
      responseTime: 'within 24 hours'
    },
    stats: {
      experience: '2+ years',
      projects: 50,
      clients: 40
    },
    education: {
      current: "Bachelor's in Computer Science (2024 - now)",
      university: 'UBIT - Umaer Basha Institute of Information Technology',
      previous: 'HSc in Computer Science from Adamjee Govt. Science College'
    }
  };

  // ========================================
  // ENHANCED INTENT MAPPING WITH WEIGHTS
  // ========================================
  
  const INTENTS = {
    greeting: {
      keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'sup', 'yo', 'howdy'],
      weight: 1
    },
    skills: {
      keywords: ['skills', 'tech stack', 'what can you do', 'technologies', 'tools', 'expertise', 'tech', 'stack', 'know', 'capable', 'frontend', 'backend', 'react', 'node'],
      weight: 1.2
    },
    hire: {
      keywords: ['hire', 'work together', 'freelance', 'services', 'job', 'work', 'collaborate', 'project', 'available', 'rate', 'pricing', 'cost', 'price', 'how much', 'budget'],
      weight: 1.5
    },
    portfolio: {
      keywords: ['portfolio', 'projects', 'works', 'examples', 'showcase', 'samples', 'previous work', 'past work', 'github', 'code', 'demo'],
      weight: 1.2
    },
    contact: {
      keywords: ['contact', 'reach', 'email', 'message', 'phone', 'call', 'whatsapp', 'linkedin', 'social', 'connect', 'talk', 'get in touch'],
      weight: 1.3
    },
    experience: {
      keywords: ['experience', 'background', 'about', 'history', 'career', 'professional', 'work history', 'qualifications', 'who is', 'tell me about'],
      weight: 1.1
    },
    education: {
      keywords: ['education', 'study', 'degree', 'university', 'college', 'school', 'academic', 'qualification', 'learn', 'student'],
      weight: 1
    },
    location: {
      keywords: ['location', 'where', 'based', 'city', 'country', 'karachi', 'pakistan', 'remote', 'timezone'],
      weight: 1
    },
    services: {
      keywords: ['services', 'offer', 'provide', 'what do you do', 'help with', 'solutions', 'build', 'create', 'develop', 'make'],
      weight: 1.2
    },
    thanks: {
      keywords: ['thanks', 'thank you', 'appreciate', 'grateful', 'helpful', 'awesome', 'great', 'good job'],
      weight: 1
    },
    bye: {
      keywords: ['bye', 'goodbye', 'see you', 'later', 'cya', 'farewell', 'exit', 'close', 'talk soon'],
      weight: 1
    },
    help: {
      keywords: ['help', 'what can you do', 'what do you know', 'questions', 'assist', 'support'],
      weight: 1.1
    }
  };

  // Context-based follow-up keywords
  const CONTEXT_FOLLOWUPS = {
    skills: {
      frontend: ['frontend', 'react', 'next', 'javascript', 'typescript', 'css', 'html', 'ui'],
      backend: ['backend', 'node', 'express', 'database', 'mongo', 'mysql', 'server'],
      design: ['design', 'figma', 'ui/ux', 'photoshop', 'creative']
    },
    portfolio: {
      ecommerce: ['ecommerce', 'store', 'shop', 'farmstead', 'food'],
      booking: ['booking', 'hotel', 'reservation', 'app'],
      web: ['website', 'site', 'web', 'construction', 'famgce']
    }
  };

  // ========================================
  // ANALYTICS TRACKING
  // ========================================
  
  const Analytics = {
    intents: {},
    
    track(intent) {
      if (!CONFIG.analyticsEnabled) return;
      
      this.intents[intent] = (this.intents[intent] || 0) + 1;
      console.log(`[SidBot Analytics] Intent triggered: "${intent}" (count: ${this.intents[intent]})`);
      
      // Hook for future analytics integration
      this.dispatchEvent(intent);
    },
    
    dispatchEvent(intent) {
      // Custom event for external analytics tools
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sidbot:intent', { 
          detail: { intent, timestamp: new Date().toISOString() } 
        }));
      }
    },
    
    getReport() {
      return { ...this.intents };
    }
  };

  // ========================================
  // RESPONSE GENERATOR
  // ========================================
  
  const ResponseGenerator = {
    // Generate dynamic skills response
    skills() {
      const allSkills = [
        ...KNOWLEDGE.skills.frontend,
        ...KNOWLEDGE.skills.backend,
        ...KNOWLEDGE.skills.design
      ];
      const skillsList = allSkills.slice(0, 7).join(', ');
      
      return `Saad is skilled in ${skillsList} and more! 🚀<br><br>
        <strong>Frontend:</strong> ${KNOWLEDGE.skills.frontend.join(', ')}<br>
        <strong>Backend:</strong> ${KNOWLEDGE.skills.backend.join(', ')}<br>
        <strong>Design:</strong> ${KNOWLEDGE.skills.design.join(', ')}<br><br>
        He builds full-stack apps and stunning UIs! Check out his 
        <a href="${KNOWLEDGE.socials.github.url}" target="_blank" rel="noopener noreferrer">GitHub profile 💻</a>`;
    },

    // Generate dynamic hire response with CTA
    hire() {
      return `Saad is available for freelance projects! 💼<br><br>
        <strong>Services offered:</strong><br>
        ${KNOWLEDGE.services.map(s => `• ${s.icon} ${s.name} - ${s.desc}`).join('<br>')}<br><br>
        <a href="${KNOWLEDGE.socials.whatsapp.url}" target="_blank" rel="noopener noreferrer" class="sidbot-cta-button">
          💬 Hire Saad on WhatsApp
        </a><br><br>
        Or email him at <a href="mailto:${KNOWLEDGE.contact.email}">${KNOWLEDGE.contact.email}</a>`;
    },

    // Generate dynamic portfolio response
    portfolio() {
      return `Check out Saad's portfolio! 🎨<br><br>
        He's built ${KNOWLEDGE.stats.projects}+ projects including:<br>
        • E-commerce stores (Farmstead Foods)<br>
        • Hotel booking systems with MERN stack<br>
        • Construction company websites<br>
        • Personal portfolios<br><br>
        View his code on 
        <a href="${KNOWLEDGE.socials.github.url}" target="_blank" rel="noopener noreferrer">GitHub 💻</a> or 
        <a href="${KNOWLEDGE.socials.instagram.url}" target="_blank" rel="noopener noreferrer">Instagram 📷</a><br><br>
        Scroll up to see the Portfolio section!`;
    },

    // Generate dynamic contact response
    contact() {
      return `You can reach Saad through multiple channels! 📩<br><br>
        <strong>Quick Contact:</strong><br>
        • <a href="${KNOWLEDGE.socials.whatsapp.url}" target="_blank" rel="noopener noreferrer">WhatsApp 💬 ${KNOWLEDGE.contact.phone}</a><br>
        • <a href="mailto:${KNOWLEDGE.contact.email}">Email ✉️ ${KNOWLEDGE.contact.email}</a><br><br>
        <strong>Social Links:</strong><br>
        • <a href="${KNOWLEDGE.socials.github.url}" target="_blank" rel="noopener noreferrer">GitHub</a><br>
        • <a href="${KNOWLEDGE.socials.instagram.url}" target="_blank" rel="noopener noreferrer">Instagram</a><br>
        • <a href="${KNOWLEDGE.socials.linkedin.url}" target="_blank" rel="noopener noreferrer">LinkedIn</a><br>
        • <a href="${KNOWLEDGE.socials.twitch.url}" target="_blank" rel="noopener noreferrer">Twitch</a><br><br>
        He usually responds ${KNOWLEDGE.contact.responseTime}!`;
    },

    // Generate dynamic experience response
    experience() {
      return `${KNOWLEDGE.name} is a ${KNOWLEDGE.title} with ${KNOWLEDGE.stats.experience} of hands-on experience. 🌟<br><br>
        <strong>Highlights:</strong><br>
        • ${KNOWLEDGE.stats.projects}+ projects completed<br>
        • ${KNOWLEDGE.stats.clients}+ happy clients<br>
        • Full-stack development expertise<br>
        • UI/UX design specialization<br><br>
        He bridges the gap between design and functionality!`;
    },

    // Generate dynamic about response
    about() {
      return `${KNOWLEDGE.name} is a passionate full-stack developer with a keen eye for design. 👨‍💻<br><br>
        He specializes in translating complex ideas into visually appealing interfaces while building robust back-end functionality.<br><br>
        ${this.education()}<br><br>
        Based in ${KNOWLEDGE.contact.location} 📍 but works with clients worldwide remotely!`;
    },

    // Generate dynamic services response
    services() {
      return `Saad offers professional development and design services: 🚀<br><br>
        ${KNOWLEDGE.services.map(s => `${s.icon} <strong>${s.name}</strong><br>${s.desc}<br>`).join('<br>')}<br>
        <a href="${KNOWLEDGE.socials.whatsapp.url}" target="_blank" rel="noopener noreferrer" class="sidbot-cta-button">
          💼 Discuss Your Project
        </a>`;
    },

    // Generate dynamic education response
    education() {
      return `<strong>Education:</strong> 🎓<br>
        • ${KNOWLEDGE.education.current}<br>
        • ${KNOWLEDGE.education.university}<br>
        • ${KNOWLEDGE.education.previous}`;
    },

    // Generate dynamic location response
    location() {
      return `Saad is based in ${KNOWLEDGE.contact.location} 📍 but works with clients worldwide remotely!<br><br>
        He's comfortable working across different time zones and communicates effectively through various channels.`;
    },

    // Greeting response
    greeting() {
      return `Hey there! 👋 I'm <strong>${CONFIG.botName}</strong>, Saad's personal AI assistant.<br><br>
        I can help you learn about:<br>
        • 💻 Saad's skills & tech stack<br>
        • 🎨 His portfolio & projects<br>
        • 💼 Freelance services & hiring<br>
        • 📩 How to contact him<br><br>
        What would you like to know?`;
    },

    // Help response
    help() {
      return `Here are some things you can ask me: 🤔<br><br>
        <strong>Try asking:</strong><br>
        • "What are Saad's skills?"<br>
        • "Show me his portfolio"<br>
        • "How can I hire Saad?"<br>
        • "What's his experience?"<br>
        • "Contact information"<br>
        • "What services does he offer?"<br><br>
        Or use the quick reply buttons below!`;
    },

    // Thanks response
    thanks() {
      return `You're welcome! 😊 Feel free to ask if you need anything else about Saad. I'm here to help!`;
    },

    // Goodbye response
    bye() {
      return `Goodbye! 👋 Have a great day! Feel free to come back if you have more questions about Saad. Take care!`;
    },

    // Smart fallback with suggestions
    fallback() {
      return `That's a great question! 🤔<br><br>
        I'm not sure I understood correctly. Try asking:<br><br>
        • What are Saad's skills?<br>
        • Show portfolio<br>
        • How can I hire Saad?<br>
        • Contact information<br>
        • What services does he offer?<br><br>
        Or click one of the quick reply buttons below!`;
    },

    // Context-aware responses
    contextFollowUp(context, input) {
      const lowerInput = input.toLowerCase();
      
      if (context === 'skills') {
        if (CONTEXT_FOLLOWUPS.skills.frontend.some(k => lowerInput.includes(k))) {
          return `Saad's frontend expertise includes: ${KNOWLEDGE.skills.frontend.join(', ')}. He loves building responsive, interactive UIs with React and Next.js! ⚛️`;
        }
        if (CONTEXT_FOLLOWUPS.skills.backend.some(k => lowerInput.includes(k))) {
          return `On the backend, Saad works with: ${KNOWLEDGE.skills.backend.join(', ')}. He builds robust APIs and manages databases efficiently! 🛠️`;
        }
        if (CONTEXT_FOLLOWUPS.skills.design.some(k => lowerInput.includes(k))) {
          return `Saad's design skills include: ${KNOWLEDGE.skills.design.join(', ')}. He creates beautiful, user-centered designs! 🎨`;
        }
      }
      
      if (context === 'portfolio') {
        return `Saad has worked on various projects! Check out his GitHub for code samples or scroll up to see his portfolio section. 🚀`;
      }
      
      return null;
    }
  };

  // ========================================
  // SIDBOT CLASS
  // ========================================
  
  class SidBot {
    constructor() {
      this.isOpen = false;
      this.messages = [];
      this.context = { lastIntent: null, lastInteraction: null };
      this.isTyping = false;
      this.init();
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    
    init() {
      this.createDOM();
      this.attachEvents();
      this.loadHistory();
      this.loadContext();
      this.detectColorScheme();
    }

    // ========================================
    // DOM CREATION
    // ========================================
    
    createDOM() {
      // Create widget container
      this.widget = document.createElement('div');
      this.widget.className = 'sidbot-widget';
      this.widget.setAttribute('role', 'region');
      this.widget.setAttribute('aria-label', 'Chat with Sid Bot');

      // Create trigger button
      this.trigger = document.createElement('button');
      this.trigger.className = 'sidbot-trigger';
      this.trigger.setAttribute('aria-label', 'Open chat with Sid Bot');
      this.trigger.innerHTML = `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          <path d="M7 9h10v2H7zm0-3h10v2H7z" opacity="0.6"/>
        </svg>
      `;

      // Create chat window
      this.window = document.createElement('div');
      this.window.className = 'sidbot-window';
      this.window.setAttribute('role', 'dialog');
      this.window.setAttribute('aria-modal', 'true');
      this.window.setAttribute('aria-labelledby', 'sidbot-title');

      // Create header
      const header = document.createElement('div');
      header.className = 'sidbot-header';
      
      // Create avatar with image and fallback
      const avatarDiv = document.createElement('div');
      avatarDiv.className = 'sidbot-avatar';
      
      const avatarImg = document.createElement('img');
      avatarImg.src = CONFIG.botAvatarImage;
      avatarImg.alt = 'Sid Bot Avatar';
      avatarImg.onerror = function() {
        // Fallback to emoji if image fails to load
        this.style.display = 'none';
        const fallbackEmoji = document.createElement('span');
        fallbackEmoji.className = 'sidbot-avatar-fallback';
        fallbackEmoji.textContent = CONFIG.botAvatar;
        avatarDiv.appendChild(fallbackEmoji);
      };
      
      avatarDiv.appendChild(avatarImg);
      
      header.innerHTML = `
        <div class="sidbot-header-info">
          <div class="sidbot-avatar-container"></div>
          <div class="sidbot-header-text">
            <h4 id="sidbot-title">${CONFIG.botName}</h4>
            <p>${CONFIG.botSubtitle}</p>
          </div>
        </div>
        <button class="sidbot-close" aria-label="Close chat">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      `;
      
      // Insert avatar into header
      const avatarContainer = header.querySelector('.sidbot-avatar-container');
      avatarContainer.replaceWith(avatarDiv);

      // Create messages area
      this.messagesArea = document.createElement('div');
      this.messagesArea.className = 'sidbot-messages';

      // Create quick reply chips
      this.chipsArea = document.createElement('div');
      this.chipsArea.className = 'sidbot-chips';
      this.chipsArea.innerHTML = `
        <button class="sidbot-chip" data-intent="skills">My Skills 💻</button>
        <button class="sidbot-chip" data-intent="hire">Hire Me 💼</button>
        <button class="sidbot-chip" data-intent="portfolio">See Portfolio 🎨</button>
        <button class="sidbot-chip" data-intent="contact">Contact 📩</button>
      `;

      // Create input area
      const inputArea = document.createElement('div');
      inputArea.className = 'sidbot-input-area';
      inputArea.innerHTML = `
        <input type="text" class="sidbot-input" placeholder="Type a message..." aria-label="Type your message">
        <button class="sidbot-send" aria-label="Send message">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      `;

      // Assemble the window
      this.window.appendChild(header);
      this.window.appendChild(this.messagesArea);
      this.window.appendChild(this.chipsArea);
      this.window.appendChild(inputArea);

      // Assemble widget
      this.widget.appendChild(this.trigger);
      this.widget.appendChild(this.window);

      // Append to body
      document.body.appendChild(this.widget);

      // Store references
      this.input = inputArea.querySelector('.sidbot-input');
      this.sendBtn = inputArea.querySelector('.sidbot-send');
      this.closeBtn = header.querySelector('.sidbot-close');
      this.chips = this.chipsArea.querySelectorAll('.sidbot-chip');
    }

    // ========================================
    // EVENT HANDLERS
    // ========================================
    
    attachEvents() {
      // Toggle chat window
      this.trigger.addEventListener('click', () => this.toggle());

      // Close button
      this.closeBtn.addEventListener('click', () => this.close());

      // Send message
      this.sendBtn.addEventListener('click', () => this.handleSend());

      // Enter key to send
      this.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !this.isTyping) {
          this.handleSend();
        }
      });

      // Quick reply chips
      this.chips.forEach(chip => {
        chip.addEventListener('click', () => {
          const intent = chip.dataset.intent;
          const text = chip.textContent;
          this.handleChipClick(intent, text);
        });
      });

      // ESC key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });

      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (this.isOpen && !this.widget.contains(e.target)) {
          this.close();
        }
      });

      // Listen for system color scheme changes
      if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
          this.detectColorScheme();
        });
      }
    }

    // ========================================
    // COLOR SCHEME DETECTION
    // ========================================
    
    detectColorScheme() {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.widget.classList.add('sidbot-dark');
      } else {
        this.widget.classList.remove('sidbot-dark');
      }
    }

    // ========================================
    // CHAT WINDOW CONTROLS
    // ========================================
    
    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    open() {
      this.isOpen = true;
      this.window.classList.add('active');
      this.trigger.setAttribute('aria-label', 'Close chat with Sid Bot');
      this.input.focus();
      
      // Show welcome message if first time
      if (this.messages.length === 0) {
        setTimeout(() => {
          this.typeBotMessage(ResponseGenerator.greeting());
        }, 300);
      }
    }

    close() {
      this.isOpen = false;
      this.window.classList.remove('active');
      this.trigger.setAttribute('aria-label', 'Open chat with Sid Bot');
      this.trigger.focus();
    }

    // ========================================
    // MESSAGE HANDLING
    // ========================================
    
    handleSend() {
      const text = this.input.value.trim();
      if (!text || this.isTyping) return;

      // Add user message
      this.addUserMessage(text);
      this.input.value = '';

      // Generate and show bot response
      this.showTypingIndicator(() => {
        const response = this.generateResponse(text);
        this.typeBotMessage(response);
      });
    }

    handleChipClick(intent, text) {
      if (this.isTyping) return;
      
      // Add user message
      this.addUserMessage(text);

      // Generate response based on intent
      this.showTypingIndicator(() => {
        const response = ResponseGenerator[intent] ? ResponseGenerator[intent]() : ResponseGenerator.fallback();
        this.typeBotMessage(response);
      });
    }

    addUserMessage(text) {
      const message = {
        type: 'user',
        text: text,
        time: this.getCurrentTime()
      };
      this.messages.push(message);
      this.renderMessage(message);
      this.saveHistory();
    }

    // Character-by-character typing animation
    typeBotMessage(htmlContent) {
      this.isTyping = true;
      
      const message = {
        type: 'bot',
        text: '', // Will be filled during animation
        fullText: htmlContent,
        time: this.getCurrentTime()
      };
      
      this.messages.push(message);
      
      // Create message element
      const msgDiv = document.createElement('div');
      msgDiv.className = 'sidbot-message bot typing-message';
      msgDiv.innerHTML = `<span class="typing-content"></span><span class="sidbot-message-time">${message.time}</span>`;
      this.messagesArea.appendChild(msgDiv);
      
      const contentSpan = msgDiv.querySelector('.typing-content');
      
      // Parse HTML and type it out
      this.animateTyping(contentSpan, htmlContent, () => {
        msgDiv.classList.remove('typing-message');
        msgDiv.innerHTML = `${htmlContent}<span class="sidbot-message-time">${message.time}</span>`;
        this.isTyping = false;
        this.saveHistory();
      });
      
      this.scrollToBottom();
    }

    animateTyping(element, html, callback) {
      // Create a temporary element to parse HTML
      const temp = document.createElement('div');
      temp.innerHTML = html;
      
      // Get text content for typing animation
      const textContent = temp.textContent || temp.innerText || '';
      const totalChars = textContent.length;
      
      let currentChar = 0;
      const typeChar = () => {
        if (currentChar < totalChars) {
          // Show partial content
          const progress = (currentChar + 1) / totalChars;
          const visibleLength = Math.floor(textContent.length * progress);
          element.textContent = textContent.substring(0, visibleLength) + '▋';
          currentChar++;
          
          // Adjust speed based on punctuation
          const char = textContent[currentChar];
          let delay = CONFIG.charTypingSpeed;
          if (char === '.' || char === '!' || char === '?') delay *= 3;
          if (char === ',') delay *= 2;
          
          setTimeout(typeChar, delay);
        } else {
          element.textContent = '';
          callback();
        }
      };
      
      typeChar();
    }

    renderMessage(message) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `sidbot-message ${message.type}`;
      msgDiv.innerHTML = `
        ${message.type === 'bot' ? message.text : this.escapeHtml(message.text)}
        <span class="sidbot-message-time">${message.time}</span>
      `;
      this.messagesArea.appendChild(msgDiv);
      this.scrollToBottom();
    }

    showTypingIndicator(callback) {
      const typingDiv = document.createElement('div');
      typingDiv.className = 'sidbot-typing';
      typingDiv.id = 'sidbot-typing-indicator';
      typingDiv.innerHTML = `
        <div class="sidbot-typing-dot"></div>
        <div class="sidbot-typing-dot"></div>
        <div class="sidbot-typing-dot"></div>
      `;
      this.messagesArea.appendChild(typingDiv);
      this.scrollToBottom();

      setTimeout(() => {
        typingDiv.remove();
        callback();
      }, CONFIG.typingDelay);
    }

    scrollToBottom() {
      this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
    }

    getCurrentTime() {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // ========================================
    // ENHANCED INTENT DETECTION WITH SCORING
    // ========================================
    
    generateResponse(input) {
      const lowerInput = input.toLowerCase().trim();
      
      // Check for context-based follow-up first
      if (this.context.lastIntent && this.context.lastInteraction) {
        const timeSinceLastInteraction = Date.now() - this.context.lastInteraction;
        // Context valid for 2 minutes
        if (timeSinceLastInteraction < 120000) {
          const contextResponse = ResponseGenerator.contextFollowUp(this.context.lastIntent, input);
          if (contextResponse) {
            this.updateContext('context-followup');
            Analytics.track('context-followup');
            return contextResponse;
          }
        }
      }
      
      // Score-based intent detection
      const scores = this.calculateIntentScores(lowerInput);
      const bestMatch = this.getBestIntentMatch(scores);
      
      if (bestMatch) {
        this.updateContext(bestMatch.intent);
        Analytics.track(bestMatch.intent);
        
        // Generate response using ResponseGenerator
        if (ResponseGenerator[bestMatch.intent]) {
          return ResponseGenerator[bestMatch.intent]();
        }
      }
      
      // Check for specific questions
      if (lowerInput.includes('name') && lowerInput.includes('your')) {
        return `I'm <strong>${CONFIG.botName}</strong>, Saad's personal AI assistant! 🤖`;
      }

      if (lowerInput.includes('name') && lowerInput.includes('saad')) {
        return `Saad's full name is <strong>${KNOWLEDGE.fullName}</strong>.`;
      }

      if (lowerInput.includes('old') || lowerInput.includes('age')) {
        Analytics.track('experience');
        return ResponseGenerator.experience();
      }

      if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('rate') || lowerInput.includes('how much')) {
        Analytics.track('hire');
        return ResponseGenerator.hire();
      }

      if (lowerInput.includes('react') || lowerInput.includes('next') || lowerInput.includes('node')) {
        Analytics.track('skills');
        return ResponseGenerator.skills();
      }

      if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
        Analytics.track('help');
        return ResponseGenerator.help();
      }

      // Default fallback with suggestions
      Analytics.track('fallback');
      return ResponseGenerator.fallback();
    }

    calculateIntentScores(input) {
      const scores = {};
      
      for (const [intent, data] of Object.entries(INTENTS)) {
        let score = 0;
        const words = input.split(/\s+/);
        
        for (const keyword of data.keywords) {
          // Exact match gets higher score
          if (input === keyword) {
            score += 3 * data.weight;
          }
          // Contains full keyword phrase
          else if (input.includes(keyword)) {
            score += 2 * data.weight;
          }
          // Partial word match
          else {
            for (const word of words) {
              if (keyword.includes(word) || word.includes(keyword)) {
                score += 0.5 * data.weight;
              }
            }
          }
        }
        
        if (score > 0) {
          scores[intent] = score;
        }
      }
      
      return scores;
    }

    getBestIntentMatch(scores) {
      const entries = Object.entries(scores);
      if (entries.length === 0) return null;
      
      // Sort by score descending
      entries.sort((a, b) => b[1] - a[1]);
      
      const [bestIntent, bestScore] = entries[0];
      
      // Check if score meets minimum threshold
      if (bestScore >= CONFIG.minIntentScore) {
        return { intent: bestIntent, score: bestScore };
      }
      
      return null;
    }

    updateContext(intent) {
      this.context.lastIntent = intent;
      this.context.lastInteraction = Date.now();
      this.saveContext();
    }

    // ========================================
    // STORAGE MANAGEMENT
    // ========================================
    
    saveHistory() {
      try {
        const history = this.messages.slice(-CONFIG.maxHistory);
        sessionStorage.setItem(CONFIG.storageKey, JSON.stringify(history));
      } catch (e) {
        console.warn('SidBot: Could not save chat history');
      }
    }

    loadHistory() {
      try {
        const history = sessionStorage.getItem(CONFIG.storageKey);
        if (history) {
          this.messages = JSON.parse(history);
          this.messages.forEach(msg => {
            // Skip typing animation for loaded messages
            const msgDiv = document.createElement('div');
            msgDiv.className = `sidbot-message ${msg.type}`;
            const content = msg.type === 'bot' ? (msg.fullText || msg.text) : this.escapeHtml(msg.text);
            msgDiv.innerHTML = `${content}<span class="sidbot-message-time">${msg.time}</span>`;
            this.messagesArea.appendChild(msgDiv);
          });
          this.scrollToBottom();
        }
      } catch (e) {
        console.warn('SidBot: Could not load chat history');
      }
    }

    saveContext() {
      try {
        sessionStorage.setItem(CONFIG.contextKey, JSON.stringify(this.context));
      } catch (e) {
        console.warn('SidBot: Could not save context');
      }
    }

    loadContext() {
      try {
        const context = sessionStorage.getItem(CONFIG.contextKey);
        if (context) {
          this.context = JSON.parse(context);
        }
      } catch (e) {
        console.warn('SidBot: Could not load context');
      }
    }

    // ========================================
    // UTILITIES
    // ========================================
    
    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }

  // ========================================
  // INITIALIZATION
  // ========================================
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.sidBot = new SidBot();
    });
  } else {
    window.sidBot = new SidBot();
  }

  // Expose analytics for debugging
  window.sidBotAnalytics = Analytics;

})();
