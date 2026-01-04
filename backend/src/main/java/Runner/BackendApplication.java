package Runner;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import service.repository.ItemRepository;

@SpringBootApplication
@EnableCaching
@EnableJpaAuditing
@ComponentScan(basePackages = {"service**","service*", "config", "controller"})
@EnableJpaRepositories(basePackages = {"service.repository"})
@EntityScan(basePackages = {"service.entity"})
@Slf4j
public class BackendApplication {

    public static void main(String[] args) {
        log.info("Starting Lost and Found Backend Application...");
        var res = SpringApplication.run(BackendApplication.class, args);
        System.out.println(res.getBean(ItemRepository.class).findAll());
        log.info("Lost and Found Backend Application started successfully!");
    }

}
