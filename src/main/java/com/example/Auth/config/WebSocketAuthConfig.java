package com.example.Auth.config;

import com.example.Auth.service.Security.JwtService;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
public class WebSocketAuthConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public WebSocketAuthConfig(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                // ✅ Authentification lors de la connexion WebSocket
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String authToken = accessor.getFirstNativeHeader("Authorization");

                    if (authToken != null && authToken.startsWith("Bearer ")) {
                        String token = authToken.substring(7);

                        try {
                            // ✅ Extraction du username depuis le token
                            String username = jwtService.extractUsername(token);

                            if (username != null) {
                                // ✅ Chargement des détails utilisateur
                                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                                // ✅ Validation du token
                                if (jwtService.isTokenValid(token, userDetails)) {
                                    UsernamePasswordAuthenticationToken authentication =
                                            new UsernamePasswordAuthenticationToken(
                                                    userDetails,
                                                    null,
                                                    userDetails.getAuthorities()
                                            );

                                    // ✅ Important : définir l'utilisateur principal pour les destinations /user/...
                                    accessor.setUser(authentication);

                                    System.out.println("✅ WebSocket authenticated: " + username);
                                } else {
                                    System.err.println("❌ Invalid JWT token for WebSocket");
                                }
                            }
                        } catch (Exception e) {
                            System.err.println("❌ WebSocket authentication error: " + e.getMessage());
                        }
                    } else {
                        System.err.println("❌ No Authorization header in WebSocket connection");
                    }
                }

                return message;
            }
        });
    }
}