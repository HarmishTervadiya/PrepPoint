export interface Course{
    _id: string;
    courseName: string;
    createAt: string;
}

export interface CourseState {
    courses: Course[];
    courseDetails: string | null;
    coursesLoading: boolean;
    coursesError: string | null;
  }
  