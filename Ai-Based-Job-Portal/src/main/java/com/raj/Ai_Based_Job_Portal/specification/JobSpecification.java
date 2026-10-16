package com.raj.Ai_Based_Job_Portal.specification;

import com.raj.Ai_Based_Job_Portal.entity.Job;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class JobSpecification {
    public static Specification<Job> hasKeyword(String keyword){
        return (root, query, cb)->
                keyword == null
                        ? null
                        :cb.or(
                                cb.like(
                                        cb.lower(root.get("title")),
                                        "%" + keyword.toLowerCase()+ "%"
                                ),
                                cb.like(
                                        cb.lower(root.get("description")),
                                        "%" + keyword.toLowerCase() + "%"
                                )
                        );
    }
    public static Specification<Job> hasLocation(String location){
        return (root, query, cb)->
                location==null
                ? null
                        :cb.like(
                                cb.lower(root.get("location")),
                        "%" + location.toLowerCase()+ "%"
                );
    }
}
