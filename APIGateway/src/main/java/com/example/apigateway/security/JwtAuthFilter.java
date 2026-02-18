package com.example.apigateway.security;

import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthFilter implements GlobalFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange,
                             GatewayFilterChain chain) {

        // ✅ AUTORISER LES REQUÊTES CORS PREFLIGHT
        if ("OPTIONS".equals(exchange.getRequest().getMethod().name())) {
            return chain.filter(exchange);
        }

        String path = exchange.getRequest().getURI().getPath();

        // ======================
        // 🔓 ROUTES PUBLIQUES
        // ======================
        if (
                path.startsWith("/auth") ||
                        (path.startsWith("/reclamations") && !path.contains("/etat")) ||
                        path.startsWith("/api/products") ||
                        path.startsWith("/api/product-types") ||
                        path.startsWith("/api/product-locations") ||
                        path.startsWith("/api/historique") ||
                        path.startsWith("/api/factures")
        ) {
            return chain.filter(exchange);
        }

        // ======================
        // 🔒 TOKEN OBLIGATOIRE
        // ======================
        String authHeader = exchange.getRequest()
                .getHeaders()
                .getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);

        if (!jwtUtil.isTokenValid(token)) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // ======================
        // 🔐 ADMIN SEULEMENT
        // ======================
        if (
                path.startsWith("/users") ||
                        path.endsWith("/etat")
        ) {
            String role = jwtUtil.extractRole(token);
            if (!"ADMIN".equals(role)) {
                exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                return exchange.getResponse().setComplete();
            }
        }

        return chain.filter(exchange);
    }
}
