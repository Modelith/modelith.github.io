package BicycleLight {
    requirement def BrightEnough {
        doc /* 夜道で 10 m 先まで照らせる */
    }

    part def Light {
        part battery : Battery;
        part led : Led;
        part button : Switch;
        flow from battery to led;
    }
    part def Battery {
        attribute voltage = 3.7;
    }
    part def Led;
    part def Switch;

    satisfy BrightEnough by Light;
}
