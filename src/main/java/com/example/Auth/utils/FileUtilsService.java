package com.example.Auth.utils;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class FileUtilsService {

    public byte[] convertToBytes(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;
        return file.getBytes();
    }
}
