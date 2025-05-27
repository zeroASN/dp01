package cn.edu.ctbu.dp01.api;

import cn.edu.ctbu.dp01.entity.Student;
import cn.edu.ctbu.dp01.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentApiController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/list")
    public List<Student> findAll() {

        List<Student> students = studentService.getAll();
        return students;
    }

    @GetMapping("/{id}")
    public Student findById(@PathVariable int id) {

        Student student = studentService.findById(id);
        return student;
    }

    @PostMapping("/add")
    public Student add(Student student) {

        return studentService.add(student);

    }

    @PutMapping("/update")
    public Student update(Student student) {

        return studentService.update(student);

    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Integer id) {

        studentService.delete(id);

    }
}
