package cn.edu.ctbu.dp01.service;

import cn.edu.ctbu.dp01.dao.StudentRepository;
import cn.edu.ctbu.dp01.entity.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    public StudentRepository studentRepository;

    /**
     * 读所有的学生列表
     * @return List Student
     */
    public List<Student> getAll() {

        return studentRepository.findAll();
    }

    /**
     * 按id进行查询
     * @param id 主键，整数
     * @return
     */
    public Student findById(Integer id){


        return studentRepository.findById(id).get();
    }

    /**
     * 按名字进行查询，like
     * @param name
     * @return
     */
    public List<Student> findByName(String name){


        return studentRepository.findByNameLike(name);
    }

    /**
     * 按名字和密码查询
     * @param name
     * @param password
     * @return
     */
    public List<Student> findByNameAndPassword(String name, String password){


        return studentRepository.findByNameAndPassword(name, password);
    }


    public void insert(Student student){
        studentRepository.save(student);
    }

    /**
     * 新增学生
     * @param student
     * @return
     */
    public Student add(Student student){
        return studentRepository.save(student);
    }

    /**
     * 更新学生
     * @param student
     * @return
     */
    public Student update(Student student){
        return studentRepository.save(student);
    }

    /**
     * 删除学生
     * @param id
     */
    public void delete(Integer id){
        studentRepository.deleteById(id);
    }
}
