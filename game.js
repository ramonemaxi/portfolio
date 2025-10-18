document.addEventListener('DOMContentLoaded', () => {
    const terminalContainer = document.querySelector('.terminal-container');
    const terminalBody = document.getElementById('terminal-body');
    const terminalInput = document.getElementById('terminal-input');
    const minimizeButton = document.getElementById('minimize-button');
    const maximizeButton = document.getElementById('maximize-button');

    let isMinimized = false;
    let currentInspectedProject = null;

    const projectsData = {
        'taskai': {
            name: 'TaskAI - Sistema de Gestión de Tareas Inteligente',
            description: 'Gestor de tareas con IA que aprende tus patrones de productividad y sugiere horarios óptimos, implementado con principios SOLID y API REST.',
            githubUrl: 'https://github.com/ramonemaxi/TaskAI'
        },
        'scrap': {
            name: 'PROYECTO DE SCRAPING (SCRAP)',
            description: 'Este proyecto es un web scraper diseñado para extraer información de un sitio web gubernamental argentino. Utiliza Selenium para la automatización del navegador y SQLite para el almacenamiento de datos.',
            githubUrl: 'https://github.com/ramonemaxi/SCRAP'
        },
        'python-mcp': {
            name: 'Python MCP Timesheet Assistant',
            description: 'Un asistente para gestionar hojas de tiempo en Python.',
            githubUrl: 'https://github.com/ramonemaxi/python-mcp-timesheet-assistant'
        },
        'agente-ia': {
            name: 'Agente IA RAG LMStudio',
            description: 'Un agente de IA que utiliza la arquitectura RAG (Retrieval Augmented Generation) para responder preguntas utilizando una base de conocimiento local.',
            githubUrl: 'https://github.com/ramonemaxi/agente-ia-rag-lmstudio'
        },
        'extractor-facturas': {
            name: 'Extractor de Facturas con Visión-IA',
            description: 'Un sistema inteligente que utiliza visión por computadora y OCR para extraer y procesar automáticamente datos clave de facturas, optimizando la gestión documental.',
            githubUrl: 'https://github.com/ramonemaxi/extractor-de-facturas'
        }
    };

    const commands = {
        'ayuda': 'Muestra los comandos disponibles.',
        'sobremi': 'Conoce un poco más sobre Maxi.',
        'habilidades': 'Descubre las habilidades técnicas de Maxi.',
        'proyectos': 'Lista algunos proyectos destacados de Maxi.',
        'contacto': 'Obtén información de contacto de Maxi.',
        'limpiar': 'Limpia la pantalla de la terminal.',
        'cls': 'Limpia la pantalla de la terminal (alias de limpiar).',
        'salir': 'Vuelve al portfolio principal.',
        'list-projects': 'Lista los proyectos disponibles para inspeccionar.',
        'inspect <nombre_proyecto>': 'Muestra detalles de un proyecto. Luego usa \'go\' para abrir el repositorio.',
        'go': 'Abre el repositorio del proyecto actualmente inspeccionado.'
    };

    const responses = {
        'sobremi': 'Soy Maximiliano Benegas, un desarrollador Python apasionado por crear soluciones eficientes y escalables. Me especializo en desarrollo backend con Django y FastAPI, automatización de tareas, web scraping y desarrollo de aplicaciones a medida. Disfruto aprendiendo nuevas tecnologías y aplicándolas para resolver problemas complejos.',
        'habilidades': 'Python, Django, FastAPI, SQL, Docker, Git, Web Scraping (Selenium, BeautifulSoup), Automatización, APIs REST, JavaScript, HTML, CSS.',
        'proyectos': 'Algunos de mis proyectos destacados incluyen: TaskAI (Gestor de Tareas Inteligente con IA), Extractor de Facturas con Visión-IA, y un Agente IA RAG con LMStudio. Puedes ver más en mi portfolio principal.',
        'contacto': 'Puedes contactarme a través de LinkedIn: /in/maximilianobenegas/ o GitHub: /ramonemaxi. También puedes encontrar mi email en mi portfolio principal.',
        'ayuda': () => {
            let helpText = 'Comandos disponibles:\n';
            for (const cmd in commands) {
                helpText += `- ${cmd}: ${commands[cmd]}\n`;
            }
            return helpText;
        },
        'salir': () => {
            window.location.href = 'index.html';
            return 'Volviendo al portfolio...';
        },
        'list-projects': () => {
            let projectList = 'Proyectos disponibles (usa inspect <nombre_proyecto>):\n';
            for (const key in projectsData) {
                projectList += `- ${key} (${projectsData[key].name})\n`;
            }
            return projectList;
        }
    };

    function addLineToTerminal(text, isInput = false) {
        const line = document.createElement('div');
        line.classList.add('terminal-output');
        if (isInput) {
            line.innerHTML = `<span class="terminal-prompt">maxi@portfolio:~$</span> ${text}`;
        } else {
            line.textContent = text;
        }
        terminalBody.insertBefore(line, terminalInput.parentNode);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    terminalInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const fullCommand = terminalInput.value.trim().toLowerCase();
            addLineToTerminal(fullCommand, true);
            terminalInput.value = '';

            const parts = fullCommand.split(' ');
            const command = parts[0];
            const arg = parts[1];

            if (command === 'limpiar' || command === 'cls') {
                const currentInputLine = terminalInput.parentNode;
                terminalBody.innerHTML = '';
                terminalBody.appendChild(currentInputLine);
            } else if (command === 'salir') {
                responses.salir();
            }
            else if (command === 'list-projects') {
                addLineToTerminal(responses['list-projects']());
            } else if (command === 'inspect') {
                if (arg && projectsData[arg]) {
                    currentInspectedProject = projectsData[arg];
                    let output = `Inspeccionando: ${currentInspectedProject.name}\n`;
                    output += `Descripción: ${currentInspectedProject.description}\n`;
                    output += `Escribe \'go\' para abrir el repositorio en GitHub.`;
                    addLineToTerminal(output);
                } else if (arg) {
                    addLineToTerminal(`Error: Proyecto '${arg}' no encontrado. Usa 'list-projects' para ver los proyectos disponibles.`);
                } else {
                    addLineToTerminal('Uso: inspect <nombre_proyecto>');
                }
            } else if (command === 'go') {
                if (currentInspectedProject) {
                    addLineToTerminal(`Abriendo ${currentInspectedProject.name} en GitHub...`);
                    window.open(currentInspectedProject.githubUrl, '_blank');
                    currentInspectedProject = null; // Reset after opening
                } else {
                    addLineToTerminal('Ningún proyecto está siendo inspeccionado. Usa \'inspect <nombre_proyecto>\' primero.');
                }
            } else if (commands[command]) {
                const response = responses[command];
                if (typeof response === 'function') {
                    addLineToTerminal(response());
                } else {
                    addLineToTerminal(response);
                }
            } else {
                addLineToTerminal(`Comando no reconocido: '${fullCommand}'. Escribe 'ayuda' para ver los comandos disponibles.`);
            }
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });

    minimizeButton.addEventListener('click', () => {
        terminalContainer.classList.toggle('minimized');
        isMinimized = !isMinimized;
        if (!isMinimized) {
            terminalInput.focus();
        }
    });

    maximizeButton.addEventListener('click', () => {
        terminalContainer.classList.remove('minimized');
        isMinimized = false;
        terminalInput.focus();
    });

    // Focus the input when clicking anywhere on the terminal body
    terminalBody.addEventListener('click', () => {
        terminalInput.focus();
    });

    terminalInput.focus();
});
