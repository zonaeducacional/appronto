const CACHE_NAME = 'app-service-v1';
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/admin.html',
    '/manifest.json',
    '/admin.css',
    '/admin.js'
];

// URLs externas que serão cacheadas
const EXTERNAL_CACHE_URLS = [
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching app shell');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                console.log('Service Worker: Successfully cached all files');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Cache failed', error);
            })
    );
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Clearing old cache');
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Estratégia para URLs externas (CDNs)
    if (EXTERNAL_CACHE_URLS.some(externalUrl => url.href.includes(externalUrl))) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        return response;
                    }
                    
                    // Clone da requisição
                    const fetchRequest = event.request.clone();
                    
                    return fetch(fetchRequest).then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone da resposta
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                        
                        return response;
                    }).catch(error => {
                        console.log('Service Worker: Fetch failed for external resource', error);
                        // Retorna uma resposta padrão para recursos externos offline
                        return new Response('Offline - Recurso não disponível', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/plain'
                            })
                        });
                    });
                })
        );
        return;
    }
    
    // Estratégia para imagens do Unsplash
    if (url.hostname === 'images.unsplash.com') {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        return response;
                    }
                    
                    return fetch(event.request)
                        .then(response => {
                            if (!response || response.status !== 200) {
                                return response;
                            }
                            
                            // Cache de imagens por 24 horas
                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                            
                            return response;
                        })
                        .catch(() => {
                            // Retorna uma imagem placeholder offline
                            return new Response(
                                '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="#6b7280" text-anchor="middle" dominant-baseline="middle">Imagem não disponível offline</text></svg>',
                                {
                                    headers: { 'Content-Type': 'image/svg+xml' }
                                }
                            );
                        });
                })
        );
        return;
    }
    
    // Estratégia Cache First para requisições de navegação
    if (event.request.mode === 'navigate') {
        event.respondWith(
            caches.match('/index.html')
                .then(response => {
                    return response || fetch(event.request);
                })
        );
        return;
    }
    
    // Estratégia Cache First para outros recursos
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                
                return fetch(event.request)
                    .then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                        
                        return response;
                    })
                    .catch(error => {
                        console.log('Service Worker: Fetch failed', error);
                        
                        // Retorna respostas offline para diferentes tipos de conteúdo
                        if (event.request.destination === 'script') {
                            return new Response('console.log("Offline - Script não disponível");', {
                                headers: { 'Content-Type': 'application/javascript' }
                            });
                        }
                        
                        if (event.request.destination === 'style') {
                            return new Response('body { background: #f3f4f6; }', {
                                headers: { 'Content-Type': 'text/css' }
                            });
                        }
                        
                        return new Response('Offline - Conteúdo não disponível', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});

// Mensagens do cliente
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(cache => {
                    return cache.addAll(event.data.payload);
                })
        );
    }
});

// Sincronização em segundo plano (quando disponível)
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(
            // Aqui você pode implementar lógica de sincronização
            // Por exemplo, enviar formulários quando a conexão for restabelecida
            console.log('Service Worker: Background sync triggered')
        );
    }
});

// Notificações push (quando disponível)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiByeD0iMjQiIGZpbGw9IiM0RjQ2RTUiLz4KPHBhdGggZD0iTTk2IDQ4QzY5LjUgNDggNDggNjkuNSA0OCA5NkM0OCAxMjIuNSA2OS41IDE0NCA5NiAxNDRDMTIyLjUgMTQ0IDE0NCAxMjIuNSAxNDQgOTZDMTQ0IDY5LjUgMTIyLjUgNDggOTYgNDhaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNODAgNzJWODRIMTEyVjcySDgwWk04MCA5NlYxMDhIMTEyVjk2SDgwWk04MCAxMjBWMTMySDExMlYxMjBIMTBaIiBmaWxsPSIjNEY0NkU1Ii8+Cjwvc3ZnPg==',
            badge: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHZpZXdCb3g9IjAgMCA3MiA3MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjcyIiBoZWlnaHQ9IjcyIiByeD0iMTAiIGZpbGw9IiM0RjQ2RTUiLz4KPHBhdGggZD0iTTM2IDE4QzI2LjEgMTggMTggMjYuMSAxOCAzNkMxOCA0NS45IDI2LjEgNTQgMzYgNTRDNDUuOSA1NCA1NCA0NS45IDU0IDM2QzU0IDI2LjEgNDUuOSAxOCAzNiAxOFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0zMCAyN1YzNE00MlYyNUgzMFpNMzAgMzNWNDFINDJWMzNIMTBaIiBmaWxsPSIjNEY0NkU1Ii8+Cjwvc3ZnPg==',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            }
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Gerenciamento de cliques em notificações
self.addEventListener('notificationclick', event => {
    console.log('Service Worker: Notification click received');
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});
