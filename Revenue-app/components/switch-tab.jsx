<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dubai Affiliates</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        /* Transição suave do menu mobile */
        .sidebar-transition { transition: transform 0.3s ease-in-out; }
    </style>
</head>
<body class="bg-gray-50 flex h-screen overflow-hidden font-sans text-gray-800">

    <div id="mobile-overlay" onclick="toggleSidebar()" class="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 hidden lg:hidden"></div>

    <aside id="sidebar" class="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col h-full transform -translate-x-full lg:translate-x-0 lg:relative lg:flex sidebar-transition">
        <div class="p-6 flex justify-between items-center">
            <h1 class="text-2xl font-extrabold text-blue-600 tracking-tight leading-tight">
                <i class="fa-solid fa-gem mr-2"></i>Dubai<br><span class="text-gray-800 text-lg">Affiliates</span>
            </h1>
            <button onclick="toggleSidebar()" class="lg:hidden text-gray-500 hover:text-gray-800 text-xl">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>

        <nav class="flex-1 overflow-y-auto px-4 space-y-6 pb-6">
            <div>
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu Principal</p>
                <a href="#" onclick="switchTab('regras')" id="nav-regras" class="nav-item flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                    <i class="fa-solid fa-shield-halved w-5 mr-2"></i> Regras de Divulgação
                </a>
            </div>

            <div>
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Relatórios</p>
                <a href="#" onclick="switchTab('dashboard')" id="nav-dashboard" class="nav-item flex items-center px-3 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-900 transition-colors">
                    <i class="fa-solid fa-border-all w-5 mr-2"></i> Overview
                </a>
                
                <div class="mt-1">
                    <button onclick="toggleSubmenu('houses-menu')" class="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                        <div class="flex items-center">
                            <i class="fa-regular fa-file-lines w-5 mr-2"></i> Detalhados por Casa
                        </div>
                        <i class="fa-solid fa-chevron-down text-xs transition-transform duration-200" id="icon-houses-menu"></i>
                    </button>
                    <div id="houses-menu" class="pl-8 space-y-1 mt-1">
                        <a href="#" onclick="showHouse('BetMGM')" class="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 border-l-2 border-transparent hover:border-blue-600">BetMGM</a>
                        <a href="#" onclick="showHouse('Novibet')" class="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 border-l-2 border-transparent hover:border-blue-600">Novibet</a>
                        <a href="#" onclick="showHouse('SuperBet')" class="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 border-l-2 border-transparent hover:border-blue-600">SuperBet</a>
                        <a href="#" onclick="showHouse('LotusBet')" class="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 border-l-2 border-transparent hover:border-blue-600">LotusBet</a>
                    </div>
                </div>
            </div>

            <div>
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Administração</p>
                <a href="#" onclick="switchTab('adm')" id="nav-adm" class="nav-item flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                    <i class="fa-solid fa-user-shield w-5 mr-2"></i> Painel ADM
                </a>
            </div>
        </nav>
    </aside>

    <main class="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between lg:justify-end px-4 lg:px-8 shrink-0">
            <button onclick="toggleSidebar()" class="lg:hidden text-gray-600 hover:text-gray-900 text-xl focus:outline-none">
                <i class="fa-solid fa-bars"></i>
            </button>
            
            <div class="flex items-center space-x-4 text-gray-500">
                <button class="hover:text-gray-800"><i class="fa-regular fa-moon"></i></button>
                <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-sm text-gray-600">DA</div>
            </div>
        </header>

        <div class="flex-1 overflow-y-auto p-4 lg:p-8">
            
            <section id="view-dashboard" class="tab-content block">
                <div class="mb-6 overflow-x-auto pb-2">
                    <div class="flex items-center space-x-2 whitespace-nowrap min-w-max">
                        <span class="text-sm font-medium text-gray-600">Filtros ativos:</span>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 border border-gray-200 text-gray-800">Limpar Tudo <i class="fa-solid fa-xmark ml-1 cursor-pointer"></i></span>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 border border-gray-200 text-gray-800">Data início: 01/03/2026 <i class="fa-solid fa-xmark ml-1 cursor-pointer"></i></span>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 border border-gray-200 text-gray-800">Data fim: 31/03/2026 <i class="fa-solid fa-xmark ml-1 cursor-pointer"></i></span>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 border border-gray-200 text-gray-800">Todas as casas <i class="fa-solid fa-xmark ml-1 cursor-pointer"></i></span>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div class="bg-white rounded-lg border border-gray-200 p-5 flex items-center shadow-sm">
                        <div class="text-green-500 text-3xl mr-4"><i class="fa-solid fa-address-card"></i></div>
                        <div>
                            <p class="text-xs text-gray-500 font-semibold uppercase">Registro</p>
                            <p class="text-2xl font-bold text-gray-900">0</p>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg border border-gray-200 p-5 flex items-center shadow-sm">
                        <div class="text-green-500 text-3xl mr-4"><i class="fa-solid fa-mobile-screen-button"></i></div>
                        <div>
                            <p class="text-xs text-gray-500 font-semibold uppercase">FTD</p>
                            <p class="text-2xl font-bold text-gray-900">0</p>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg border border-gray-200 p-5 flex items-center shadow-sm">
                        <div class="text-green-500 text-3xl mr-4"><i class="fa-solid fa-mobile-screen"></i></div>
                        <div>
                            <p class="text-xs text-gray-500 font-semibold uppercase">QFTD</p>
                            <p class="text-2xl font-bold text-gray-900">0</p>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg border border-gray-200 p-5 flex items-center shadow-sm">
                        <div class="text-green-500 text-3xl mr-4"><i class="fa-solid fa-building-columns"></i></div>
                        <div>
                            <p class="text-xs text-gray-500 font-semibold uppercase">Depósito</p>
                            <p class="text-2xl font-bold text-gray-900">R$ 0,00</p>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg border border-gray-200 p-5 flex items-center shadow-sm">
                        <div class="text-green-500 text-3xl mr-4"><i class="fa-solid fa-chart-line"></i></div>
                        <div>
                            <p class="text-xs text-gray-500 font-semibold uppercase">REV</p>
                            <p class="text-2xl font-bold text-gray-900">R$ 0,00</p>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg border border-gray-200 p-5 flex items-center shadow-sm">
                        <div class="text-green-500 text-3xl mr-4"><i class="fa-solid fa-hand-holding-dollar"></i></div>
                        <div>
                            <p class="text-xs text-gray-500 font-semibold uppercase">CPA</p>
                            <p class="text-2xl font-bold text-gray-900">R$ 0,00</p>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg border border-gray-200 p-5 flex items-center shadow-sm sm:col-span-2 lg:col-span-1">
                        <div class="text-green-500 text-3xl mr-4"><i class="fa-solid fa-sack-dollar"></i></div>
                        <div>
                            <p class="text-xs text-gray-500 font-semibold uppercase">REV + CPA</p>
                            <p class="text-2xl font-bold text-gray-900">R$ 0,00</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="view-regras" class="tab-content hidden max-w-5xl">
                <h2 class="text-2xl font-bold text-gray-900 mb-1">Regras de Divulgação</h2>
                <p class="text-gray-500 text-sm mb-6">Diretrizes de compliance para casas parceiras do Dubai Affiliates</p>

                <div class="bg-[#fef6f3] border border-[#fbdcd0] rounded-lg p-4 lg:p-5 mb-6">
                    <div class="flex items-center mb-4">
                        <i class="fa-solid fa-shield-cat text-[#d9663e] text-xl mr-3"></i>
                        <h3 class="text-lg font-bold text-gray-900">Comunicado Oficial – Compliance</h3>
                    </div>
                    <p class="text-sm text-gray-800 leading-relaxed bg-[#fae8e0] p-4 rounded border border-[#f4cfc1]">
                        Identificamos ocorrências de uso indevido em nossa rede de afiliados, envolvendo práticas em desacordo com as diretrizes estabelecidas, tentativas de indução artificial de CPA, comunicações não aderentes às normas regulatórias e descumprimento das regras aplicáveis ao mercado regulado.
                    </p>
                </div>

                <p class="font-bold text-gray-900 mb-4 text-sm">Reiteramos que o cumprimento integral das políticas de compliance é obrigatório para todos os parceiros:</p>

                <div class="space-y-3 mb-6">
                    <div class="bg-white border border-gray-200 rounded p-4 flex items-start shadow-sm">
                        <i class="fa-regular fa-circle-xmark text-red-500 mr-3 mt-0.5 text-lg shrink-0"></i>
                        <p class="text-sm text-gray-700">Vedação expressa a qualquer tipo de promessa de ganho garantido ou comunicação que sugira retorno financeiro assegurado</p>
                    </div>
                    <div class="bg-white border border-gray-200 rounded p-4 flex items-start shadow-sm">
                        <i class="fa-regular fa-circle-check text-green-500 mr-3 mt-0.5 text-lg shrink-0"></i>
                        <p class="text-sm text-gray-700">Adoção de comunicação responsável, com a devida informação de que apostas envolvem riscos</p>
                    </div>
                    <div class="bg-white border border-gray-200 rounded p-4 flex items-start shadow-sm">
                        <i class="fa-regular fa-circle-check text-green-500 mr-3 mt-0.5 text-lg shrink-0"></i>
                        <p class="text-sm text-gray-700">Observância rigorosa às normas do CONAR e às diretrizes da SPA / Ministério da Fazenda</p>
                    </div>
                    <div class="bg-white border border-gray-200 rounded p-4 flex items-start shadow-sm">
                        <i class="fa-regular fa-circle-check text-green-500 mr-3 mt-0.5 text-lg shrink-0"></i>
                        <p class="text-sm text-gray-700">Utilização exclusiva e correta de links, tags e materiais oficiais autorizados</p>
                    </div>
                </div>

                <div class="bg-[#fef2f2] border border-red-200 rounded p-4 flex items-start shadow-sm mb-6">
                    <i class="fa-solid fa-triangle-exclamation text-red-500 mr-3 mt-0.5 shrink-0"></i>
                    <p class="text-sm text-gray-800 font-medium">O descumprimento das diretrizes, bem como qualquer tentativa de burlar regras, sistemas ou colocar a operação em risco, resultará no bloqueio imediato da conta.</p>
                </div>
            </section>

            <section id="view-casa" class="tab-content hidden max-w-3xl">
                <div class="bg-white border border-gray-200 rounded-lg p-6 lg:p-8 shadow-sm">
                    <h2 id="house-title" class="text-2xl font-bold text-gray-900 mb-2">Nome da Casa</h2>
                    <p class="text-sm text-gray-500 mb-6">Gerencie seus links de divulgação e acompanhe as métricas específicas.</p>
                    
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Seu Link de Divulgação (CPA)</label>
                        <div class="flex flex-col sm:flex-row gap-2 sm:gap-0">
                            <input type="text" id="house-link" readonly value="https://dubaiaffiliates.com/ref/seucodigo" class="flex-1 rounded-md sm:rounded-r-none sm:rounded-l-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-600 focus:outline-none w-full">
                            <button onclick="copyLink()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md sm:rounded-l-none sm:rounded-r-md text-sm font-medium transition-colors w-full sm:w-auto">
                                <i class="fa-regular fa-copy mr-2"></i> Copiar
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section id="view-adm" class="tab-content hidden">
                <div class="flex flex-col sm:flex-row justify-between sm:items-end mb-6 gap-2">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900 mb-1">Painel Administrativo</h2>
                        <p class="text-gray-500 text-sm">Gerenciamento de afiliados, acessos e manipulação de dashboard.</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="bg-white border border-gray-200 rounded-lg p-5 shadow-sm lg:col-span-1 h-fit">
                        <h3 class="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Novo Afiliado</h3>
                        <form onsubmit="event.preventDefault(); alert('Usuário adicionado com sucesso!');">
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-xs font-medium text-gray-700 mb-1">E-mail</label>
                                    <input type="email" placeholder="afiliado@email.com" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-700 mb-1">Instagram</label>
                                    <div class="flex">
                                        <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">@</span>
                                        <input type="text" placeholder="usuario" class="flex-1 w-full rounded-r-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-700 mb-1">Senha de Acesso</label>
                                    <input type="password" placeholder="••••••••" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                                </div>
                                
                                <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors mt-2">
                                    Cadastrar Afiliado
                                </button>
                            </div>
                        </form>
                    </div>

                    <div class="bg-white border border-gray-200 rounded-lg shadow-sm lg:col-span-2 flex flex-col">
                        <div class="p-4 lg:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 gap-4">
                            <h3 class="text-lg font-bold text-gray-900">Afiliados Cadastrados</h3>
                            <div class="relative w-full sm:w-auto">
                                <input type="text" placeholder="Buscar afiliado..." class="w-full sm:w-64 rounded-md border border-gray-300 pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:border-blue-500">
                                <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-gray-400 text-xs"></i>
                            </div>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm text-left text-gray-500 min-w-[600px]">
                                <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                    <tr>
                                        <th scope="col" class="px-6 py-3">Usuário</th>
                                        <th scope="col" class="px-6 py-3">Instagram</th>
                                        <th scope="col" class="px-6 py-3">Status Dashboard</th>
                                        <th scope="col" class="px-6 py-3 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="bg-white border-b hover:bg-gray-50">
                                        <td class="px-6 py-4 font-medium text-gray-900">joao.vendas@email.com</td>
                                        <td class="px-6 py-4">@joaovendas</td>
                                        <td class="px-6 py-4 text-xs">
                                            <span class="text-gray-500 block">REV+CPA: <b>R$ 1.500,00</b></span>
                                            <span class="text-gray-500 block mt-1">Casas: <b>2 ativas</b></span>
                                        </td>
                                        <td class="px-6 py-4 text-right">
                                            <button onclick="openEditModal('joao.vendas@email.com')" class="text-blue-600 hover:text-blue-900 mr-3 px-2 py-1 bg-blue-50 rounded hover:bg-blue-100 transition-colors" title="Editar Dashboard do Afiliado">
                                                <i class="fa-solid fa-pen-to-square mr-1"></i> Editar
                                            </button>
                                            <button class="text-red-600 hover:text-red-900 p-1"><i class="fa-solid fa-trash"></i></button>
                                        </td>
                                    </tr>
                                    <tr class="bg-white hover:bg-gray-50">
                                        <td class="px-6 py-4 font-medium text-gray-900">maria.ads@email.com</td>
                                        <td class="px-6 py-4">@maria_ads</td>
                                        <td class="px-6 py-4 text-xs">
                                            <span class="text-gray-500 block">REV+CPA: <b>R$ 4.200,00</b></span>
                                            <span class="text-gray-500 block mt-1">Casas: <b>4 ativas</b></span>
                                        </td>
                                        <td class="px-6 py-4 text-right">
                                            <button onclick="openEditModal('maria.ads@email.com')" class="text-blue-600 hover:text-blue-900 mr-3 px-2 py-1 bg-blue-50 rounded hover:bg-blue-100 transition-colors" title="Editar Dashboard do Afiliado">
                                                <i class="fa-solid fa-pen-to-square mr-1"></i> Editar
                                            </button>
                                            <button class="text-red-600 hover:text-red-900 p-1"><i class="fa-solid fa-trash"></i></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <div id="editModal" class="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 hidden flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fade-in-up">
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg shrink-0">
                <div>
                    <h3 class="text-lg font-bold text-gray-900">Editando Afiliado</h3>
                    <p id="modalUserName" class="text-sm text-blue-600 font-medium">usuario@email.com</p>
                </div>
                <button onclick="closeEditModal()" class="text-gray-400 hover:text-gray-700 text-xl focus:outline-none">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            
            <div class="p-6 overflow-y-auto flex-1">
                
                <h4 class="text-sm font-bold text-gray-800 mb-3 border-b pb-1 uppercase tracking-wider">1. Forçar Métricas (Overview)</h4>
                <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Registros (Qtd)</label>
                        <input type="number" value="293" class="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">FTD (Qtd)</label>
                        <input type="number" value="168" class="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">QFTD (Qtd)</label>
                        <input type="number" value="159" class="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Depósitos (R$)</label>
                        <input type="text" value="8086.43" class="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">REV (R$)</label>
                        <input type="text" value="504.28" class="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">CPA (R$)</label>
                        <input type="text" value="34000.00" class="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 outline-none">
                    </div>
                </div>

                <h4 class="text-sm font-bold text-gray-800 mb-3 border-b pb-1 uppercase tracking-wider">2. Casas, Comissões e Links</h4>
                <div class="space-y-4">
                    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col lg:flex-row lg:items-center gap-4">
                        <div class="flex items-center lg:w-48 shrink-0">
                            <input type="checkbox" checked class="h-4 w-4 text-blue-600 rounded border-gray-300">
                            <label class="ml-2 text-sm font-bold text-gray-800">BetMGM</label>
                        </div>
                        <div class="flex flex-col lg:flex-row gap-4 flex-1">
                            <div class="w-full lg:w-32 shrink-0">
                                <label class="block text-[10px] text-gray-500 uppercase mb-1">Acordo CPA (R$)</label>
                                <input type="number" value="50" class="w-full rounded border border-gray-300 px-2 py-1 text-sm outline-none">
                            </div>
                            <div class="flex-1">
                                <label class="block text-[10px] text-gray-500 uppercase mb-1">Link Personalizado do Afiliado</label>
                                <input type="text" value="https://dubaiaffiliates.com/ref/betmgm/joaovendas" class="w-full rounded border border-gray-300 px-3 py-1 text-sm outline-none text-blue-600">
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col lg:flex-row lg:items-center gap-4">
                        <div class="flex items-center lg:w-48 shrink-0">
                            <input type="checkbox" checked class="h-4 w-4 text-blue-600 rounded border-gray-300">
                            <label class="ml-2 text-sm font-bold text-gray-800">Novibet</label>
                        </div>
                        <div class="flex flex-col lg:flex-row gap-4 flex-1">
                            <div class="w-full lg:w-32 shrink-0">
                                <label class="block text-[10px] text-gray-500 uppercase mb-1">Acordo CPA (R$)</label>
                                <input type="number" value="45" class="w-full rounded border border-gray-300 px-2 py-1 text-sm outline-none">
                            </div>
                            <div class="flex-1">
                                <label class="block text-[10px] text-gray-500 uppercase mb-1">Link Personalizado do Afiliado</label>
                                <input type="text" value="https://dubaiaffiliates.com/ref/novibet/joaovendas" class="w-full rounded border border-gray-300 px-3 py-1 text-sm outline-none text-blue-600">
                            </div>
                        </div>
                    </div>

                    <div class="bg-white border border-gray-200 rounded-lg p-4 flex flex-col lg:flex-row lg:items-center gap-4 opacity-60 hover:opacity-100 transition-opacity">
                        <div class="flex items-center lg:w-48 shrink-0">
                            <input type="checkbox" class="h-4 w-4 text-blue-600 rounded border-gray-300">
                            <label class="ml-2 text-sm font-bold text-gray-800">SuperBet</label>
                        </div>
                        <div class="flex flex-col lg:flex-row gap-4 flex-1">
                            <div class="w-full lg:w-32 shrink-0">
                                <label class="block text-[10px] text-gray-500 uppercase mb-1">Acordo CPA (R$)</label>
                                <input type="number" placeholder="0.00" class="w-full rounded border border-gray-300 px-2 py-1 text-sm outline-none">
                            </div>
                            <div class="flex-1">
                                <label class="block text-[10px] text-gray-500 uppercase mb-1">Link Personalizado do Afiliado</label>
                                <input type="text" placeholder="Cole o link de trackeamento aqui..." class="w-full rounded border border-gray-300 px-3 py-1 text-sm outline-none">
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            
            <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-lg shrink-0">
                <button onclick="closeEditModal()" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    Cancelar
                </button>
                <button onclick="saveEditModal()" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors">
                    Salvar Alterações
                </button>
            </div>
        </div>
    </div>

    <script>
        // Lógica de Tabs e Menu
        function switchTab(tabId) {
            document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
            document.getElementById('view-' + tabId).classList.remove('hidden');

            document.querySelectorAll('.nav-item').forEach(el => {
                el.classList.remove('bg-gray-100', 'text-gray-900');
                el.classList.add('text-gray-600');
            });

            const activeNav = document.getElementById('nav-' + tabId);
            if (activeNav) {
                activeNav.classList.add('bg-gray-100', 'text-gray-900');
                activeNav.classList.remove('text-gray-600');
            }
            
            // Fechar sidebar no mobile após clicar
            if(window.innerWidth < 1024) toggleSidebar(true);
        }

        // Mostrar tela de Casa específica
        function showHouse(houseName) {
            document.getElementById('house-title').innerText = houseName;
            document.getElementById('house-link').value = ⁠ https://dubaiaffiliates.com/ref/${houseName.toLowerCase()}/seucodigo ⁠;
            switchTab('casa');
        }

        // Submenu (Acordeão)
        function toggleSubmenu(id) {
            const el = document.getElementById(id);
            const icon = document.getElementById('icon-' + id);
            if (el.classList.contains('hidden')) {
                el.classList.remove('hidden');
                if(icon) icon.style.transform = "rotate(180deg)";
            } else {
                el.classList.add('hidden');
                if(icon) icon.style.transform = "rotate(0deg)";
            }
        }

        // Controle da Sidebar Mobile
        function toggleSidebar(forceClose = false) {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('mobile-overlay');
            
            if (forceClose || !sidebar.classList.contains('-translate-x-full')) {
                // Fechar
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            } else {
                // Abrir
                sidebar.classList.remove('-translate-x-full');
                overlay.classList.remove('hidden');
            }
        }

        // Copiar Link
        function copyLink() {
            const linkInput = document.getElementById('house-link');
            linkInput.select();
            linkInput.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(linkInput.value);
            alert("Link copiado!");
        }

        // --- LÓGICA DO MODAL DE EDIÇÃO ---
        function openEditModal(userEmail) {
            document.getElementById('modalUserName').innerText = userEmail;
            document.getElementById('editModal').classList.remove('hidden');
            // Impede rolagem do body no fundo
            document.body.style.overflow = 'hidden'; 
        }

        function closeEditModal() {
            document.getElementById('editModal').classList.add('hidden');
            document.body.style.overflow = 'auto';
        }

        function saveEditModal() {
            alert('Dashboard do afiliado atualizada e forçada com sucesso!');
            closeEditModal();
        }
    </script>
</body>
</html>