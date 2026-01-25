// Sistema de Busca e Filtros - Robux Premium
document.addEventListener('DOMContentLoaded', function() {
    // Elementos principais
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const clearBtn = document.querySelector('.clear-search-btn');
    const suggestions = document.querySelector('.search-suggestions');
    const suggestionItems = document.querySelectorAll('.suggestion-item');
    const productCards = document.querySelectorAll('.product-card');
    const noProductsMessage = document.getElementById('noProductsMessage');
    const productsCount = document.getElementById('productsCount');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Estado do sistema
    let currentFilter = 'all';
    let currentSearch = '';
    let allProductsCount = productCards.length;

    // Inicializar o sistema
    initSystem();

    // Função para inicializar o sistema
    function initSystem() {
        console.log('🚀 Robux Premium - Sistema inicializado!');
        console.log(`📊 Total de produtos: ${allProductsCount}`);
        
        // Configurar eventos
        setupEventListeners();
        
        // Atualizar contador inicial
        updateProductsCount();
        
        // Garantir posição do header
        updateHeaderPosition();
        
        // Inicializar sugestões de busca
        initSearchSuggestions();
    }

    // Configurar todos os event listeners
    function setupEventListeners() {
        // Evento de busca no input
        searchInput.addEventListener('input', handleSearchInput);
        
        // Evento de foco na busca
        searchInput.addEventListener('focus', handleSearchFocus);
        
        // Evento de perda de foco na busca
        searchInput.addEventListener('blur', handleSearchBlur);
        
        // Evento de clique no botão de busca
        searchBtn.addEventListener('click', handleSearchButton);
        
        // Evento de Enter na busca
        searchInput.addEventListener('keypress', handleSearchEnter);
        
        // Evento de clique no botão limpar
        if (clearBtn) {
            clearBtn.addEventListener('click', handleClearSearch);
        }
        
        // Eventos de filtro
        filterButtons.forEach(button => {
            button.addEventListener('click', handleFilterClick);
        });
        
        // Fechar sugestões ao clicar fora
        document.addEventListener('click', handleClickOutside);
        
        // Atualizar posição do header quando redimensionar
        window.addEventListener('resize', updateHeaderPosition);
        
        // Smooth scroll para âncoras
        setupSmoothScroll();
    }

    // Inicializar sistema de sugestões
    function initSearchSuggestions() {
        if (!suggestionItems.length || !suggestions) return;
        
        suggestionItems.forEach(item => {
            item.addEventListener('click', function() {
                const searchTerm = this.dataset.search;
                searchInput.value = searchTerm;
                currentSearch = searchTerm.toLowerCase();
                filterProducts();
                suggestions.classList.remove('active');
                
                // Foco no input após selecionar sugestão
                searchInput.focus();
            });
        });
    }

    // Manipulador de input de busca
    function handleSearchInput(e) {
        const value = e.target.value.trim();
        currentSearch = value.toLowerCase();
        
        // Mostrar/ocultar botão limpar
        toggleClearButton(value);
        
        // Mostrar sugestões se houver texto
        if (value.length > 0 && suggestions) {
            suggestions.classList.add('active');
        } else if (suggestions) {
            suggestions.classList.remove('active');
        }
        
        // Filtrar produtos em tempo real
        filterProducts();
    }

    // Manipulador de foco na busca
    function handleSearchFocus() {
        if (searchInput.value.length > 0 && suggestions) {
            suggestions.classList.add('active');
        }
        
        // Adicionar classe de foco para animação
        document.querySelector('.search-container').classList.add('focus');
    }

    // Manipulador de perda de foco na busca
    function handleSearchBlur() {
        // Pequeno delay para permitir clique nas sugestões
        setTimeout(() => {
            if (suggestions) {
                suggestions.classList.remove('active');
            }
        }, 200);
        
        // Remover classe de foco
        document.querySelector('.search-container').classList.remove('focus');
    }

    // Manipulador de clique no botão de busca
    function handleSearchButton() {
        // Adicionar efeito de loading
        this.classList.add('loading');
        setTimeout(() => {
            this.classList.remove('loading');
        }, 300);
        
        // Ativar busca
        currentSearch = searchInput.value.toLowerCase().trim();
        filterProducts();
        
        // Esconder sugestões após busca
        if (suggestions) {
            suggestions.classList.remove('active');
        }
    }

    // Manipulador de Enter na busca
    function handleSearchEnter(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            currentSearch = searchInput.value.toLowerCase().trim();
            filterProducts();
            
            // Esconder sugestões
            if (suggestions) {
                suggestions.classList.remove('active');
            }
        }
    }

    // Manipulador de clique no botão limpar
    function handleClearSearch() {
        searchInput.value = '';
        currentSearch = '';
        filterProducts();
        
        // Esconder botão limpar
        toggleClearButton('');
        
        // Esconder sugestões
        if (suggestions) {
            suggestions.classList.remove('active');
        }
        
        // Foco no input
        searchInput.focus();
    }

    // Manipulador de clique nos filtros
    function handleFilterClick() {
        // Remove active de todos os botões
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Adiciona active no botão clicado
        this.classList.add('active');
        
        // Atualiza filtro atual
        currentFilter = this.dataset.filter;
        
        // Aplica filtro
        filterProducts();
    }

    // Manipulador de clique fora da busca
    function handleClickOutside(e) {
        if (!searchInput.contains(e.target) && !suggestions?.contains(e.target)) {
            if (suggestions) {
                suggestions.classList.remove('active');
            }
        }
    }

    // Função principal para filtrar produtos
    function filterProducts() {
        let visibleCount = 0;
        
        productCards.forEach(card => {
            const categories = card.dataset.category || '';
            const searchText = card.dataset.search || '';
            const title = card.querySelector('.product-title').textContent.toLowerCase();
            
            // Verificar se corresponde ao filtro
            let matchesFilter = currentFilter === 'all' || categories.includes(currentFilter);
            
            // Verificar se corresponde à busca
            let matchesSearch = !currentSearch || 
                title.includes(currentSearch) || 
                searchText.toLowerCase().includes(currentSearch);
            
            // Aplicar visibilidade
            if (matchesFilter && matchesSearch) {
                showProductCard(card);
                visibleCount++;
            } else {
                hideProductCard(card);
            }
        });
        
        // Atualizar contador
        updateCounterDisplay(visibleCount);
        
        // Mostrar/ocultar mensagem de nenhum produto
        toggleNoProductsMessage(visibleCount);
        
        // Log para debug
        console.log(`🔍 Busca: "${currentSearch}" | Filtro: "${currentFilter}" | Visíveis: ${visibleCount}/${allProductsCount}`);
    }

    // Mostrar card de produto com animação
    function showProductCard(card) {
        card.style.display = 'flex';
        card.style.opacity = '1';
        card.style.visibility = 'visible';
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }

    // Ocultar card de produto com animação
    function hideProductCard(card) {
        card.style.opacity = '0';
        card.style.visibility = 'hidden';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.display = 'none';
        }, 300);
    }

    // Alternar visibilidade do botão limpar
    function toggleClearButton(value) {
        if (!clearBtn) return;
        
        if (value.length > 0) {
            clearBtn.style.display = 'flex';
            clearBtn.classList.add('visible');
        } else {
            clearBtn.style.display = 'none';
            clearBtn.classList.remove('visible');
        }
    }

    // Atualizar contador de produtos
    function updateCounterDisplay(count) {
        productsCount.textContent = count;
        
        // Animação no contador
        productsCount.style.transform = 'scale(1.1)';
        setTimeout(() => {
            productsCount.style.transform = 'scale(1)';
        }, 200);
    }

    // Alternar mensagem de nenhum produto
    function toggleNoProductsMessage(visibleCount) {
        if (visibleCount === 0) {
            noProductsMessage.classList.add('show');
            noProductsMessage.style.animation = 'fadeInUp 0.5s ease-out';
        } else {
            noProductsMessage.classList.remove('show');
        }
    }

    // Atualizar contador de produtos visíveis
    function updateProductsCount() {
        const visibleProducts = document.querySelectorAll('.product-card[style*="display: flex"], .product-card:not([style])');
        const count = visibleProducts.length;
        productsCount.textContent = count;
    }

    // Atualizar posição do header (corrigir bug de fixação)
    function updateHeaderPosition() {
        const header = document.querySelector('.main-header');
        const alertBar = document.querySelector('.alert-bar');
        
        if (header && alertBar) {
            header.style.top = alertBar.offsetHeight + 'px';
        }
    }

    // Configurar smooth scroll para âncoras
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = 120;
                    const elementPosition = targetElement.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Função para resetar busca e filtros
    function resetFilters() {
        searchInput.value = '';
        currentSearch = '';
        currentFilter = 'all';
        
        // Resetar botões de filtro
        filterButtons.forEach(btn => {
            if (btn.dataset.filter === 'all') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Esconder botão limpar
        toggleClearButton('');
        
        // Mostrar todos os produtos
        filterProducts();
    }

    // Exportar funções úteis para o escopo global (se necessário)
    window.RobuxPremium = {
        resetFilters,
        filterByCategory: function(category) {
            currentFilter = category;
            filterProducts();
        },
        search: function(term) {
            searchInput.value = term;
            currentSearch = term.toLowerCase();
            filterProducts();
        }
    };

    // Mensagem de inicialização bem-sucedida
    console.log('✅ Sistema Robux Premium carregado com sucesso!');
    console.log('🔧 Recursos disponíveis:');
    console.log('   - Busca inteligente com sugestões');
    console.log('   - Filtros por categoria');
    console.log('   - Contador de produtos em tempo real');
    console.log('   - Header fixo otimizado');
    console.log('   - Design 100% responsivo');
    console.log('   - Sistema de sugestões de busca');
    console.log('   - Botão limpar busca automático');
});