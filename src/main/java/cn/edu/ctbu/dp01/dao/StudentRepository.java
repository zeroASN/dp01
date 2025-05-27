package cn.edu.ctbu.dp01.dao;

import cn.edu.ctbu.dp01.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Integer> {

    /**
     * 按名字查询
     * @param name
     * @return
     */
    List<Student> findByNameLike(String name);

    /**
     * 按名字和密码查询
     * @param name
     * @param password
     * @return
     */
    List<Student> findByNameAndPassword(String name, String password);
}
