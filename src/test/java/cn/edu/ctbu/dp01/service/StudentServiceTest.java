package cn.edu.ctbu.dp01.service;

import cn.edu.ctbu.dp01.entity.Student;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
class StudentServiceTest {

    @Autowired
    private StudentService studentService;

    @Test
    void getAll() {
        List<Student> students = studentService.getAll();

        assertNotNull(students);
    }

    @Test
    void findById() {
        Student student = studentService.findById(1);

        assertNotNull(student);
    }

    @Test
    void findByNameLike() {
         List<Student> students= studentService.findByName("邢%");

        assertNotNull(students);
    }

    @Test
    void findByNameAndPassword() {
        List<Student> students= studentService.findByNameAndPassword("邢天城", "123456");

        assertNotNull(students);
    }

    @Test
    void insert() {

        Student student = new Student();
        student.setName("赵六");
        student.setPassword("666666");
        student.setAge(18);
        student.setSex(1);
        student.setSno("20220104");

        studentService.insert(student);

        assertNotNull(student.getId());
    }

    @Test
    void update() {

        List<Student> students = studentService.findByName("赵六%");
        Student student=students.get(0);
        student.setName("赵六1");

        studentService.update(student);

        assertEquals(student.getName(), "赵六1");
    }

    @Test
    void delete() {
        studentService.delete(5);
        Student student=studentService.findById(5);
        assertNull(student);
    }
}