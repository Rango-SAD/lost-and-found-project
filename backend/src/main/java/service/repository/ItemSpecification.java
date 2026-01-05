package service.repository;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import service.entity.Item;
import service.entity.ItemCategory;
import service.entity.ItemStatus;
import service.entity.ItemTag;

import java.util.ArrayList;
import java.util.List;

public class ItemSpecification {

    public static Specification<Item> filterItems(
            Long itemId,
            ItemStatus status,
            ItemCategory category,
            ItemTag tag,
            Long userId,
            String keyword) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (itemId != null) {
                predicates.add(criteriaBuilder.equal(root.get("id"), itemId));
            }

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            if (category != null) {
                predicates.add(criteriaBuilder.equal(root.get("category"), category));
            }

            if (tag != null) {
                predicates.add(criteriaBuilder.equal(root.get("tag"), tag));
            }

            if (userId != null) {
                predicates.add(criteriaBuilder.equal(root.get("user").get("id"), userId));
            }

            if (keyword != null && !keyword.trim().isEmpty()) {
                String likePattern = "%" + keyword.toLowerCase() + "%";
                Predicate titlePredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("title")),
                        likePattern
                );
                Predicate descriptionPredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("description")),
                        likePattern
                );
                predicates.add(criteriaBuilder.or(titlePredicate, descriptionPredicate));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}

