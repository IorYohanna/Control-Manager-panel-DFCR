package com.example.Auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@EnableConfigurationProperties
@SpringBootApplication
public class DfcrApplication {

	public static void main(String[] args) {
		SpringApplication.run(DfcrApplication.class, args);
	}

}
