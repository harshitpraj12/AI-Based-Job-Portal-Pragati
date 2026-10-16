package com.raj.Ai_Based_Job_Portal.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.IOException;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ResumeAnalysisResponse {

    @JsonProperty("matchScore")
    @JsonAlias({"matchScore", "score", "match", "match_score"})
    @JsonDeserialize(using = FlexibleIntDeserializer.class)
    private Integer matchScore;

    @JsonProperty("strength")
    @JsonAlias({"strength", "strengths", "keyStrengths", "matchingSkills"})
    @JsonDeserialize(using = FlexibleStringDeserializer.class)
    private String strength;

    @JsonProperty("missingSkills")
    @JsonAlias({"missingSkills", "weaknesses", "missingSkill", "weakness", "gaps", "missing_skills"})
    @JsonDeserialize(using = FlexibleStringDeserializer.class)
    private String missingSkills;

    @JsonProperty("suggestion")
    @JsonAlias({"suggestion", "suggestions", "improvements", "recommendations"})
    @JsonDeserialize(using = FlexibleStringDeserializer.class)
    private String suggestion;

    // Deserializer to gracefully convert strings, arrays, or numbers into clean strings
    public static class FlexibleStringDeserializer extends JsonDeserializer<String> {
        @Override
        public String deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
            JsonNode node = p.getCodec().readTree(p);
            if (node == null || node.isNull()) {
                return "";
            }
            if (node.isArray()) {
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < node.size(); i++) {
                    if (i > 0) sb.append(", ");
                    sb.append(node.get(i).asText());
                }
                return sb.toString();
            }
            return node.asText();
        }
    }

    // Deserializer to gracefully convert strings like "80" or "80/100" or numbers into Integer
    public static class FlexibleIntDeserializer extends JsonDeserializer<Integer> {
        @Override
        public Integer deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
            JsonNode node = p.getCodec().readTree(p);
            if (node == null || node.isNull()) {
                return 75;
            }
            if (node.isInt() || node.isNumber()) {
                return node.asInt();
            }
            String text = node.asText().replaceAll("[^0-9]", " ").trim();
            if (!text.isEmpty()) {
                String[] parts = text.split("\\s+");
                try {
                    return Integer.parseInt(parts[0]);
                } catch (Exception ignored) {}
            }
            return 75;
        }
    }
}
