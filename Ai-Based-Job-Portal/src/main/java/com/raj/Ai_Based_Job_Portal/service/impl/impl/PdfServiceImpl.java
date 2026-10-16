package com.raj.Ai_Based_Job_Portal.service.impl.impl;

import com.raj.Ai_Based_Job_Portal.service.impl.PdfService;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class PdfServiceImpl implements PdfService {
    @Override
    public String extractText(String filePath){
        try {
            PDDocument document = Loader.loadPDF(new File(filePath));
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            document.close();
            return text;
        }catch (Exception e){
            throw new RuntimeException("Unable to Read PDF");
        }
    }
}
