package RobotVacuum {
    // 要求
    concern def QuietAtNight {
        doc /* 夜でも家族を起こさずに掃除したい */
    }
    requirement def <'R1'> CleanFloor {
        doc /* 部屋の床のごみを吸い取る */
        frame concern quiet : QuietAtNight;
    }
    requirement def <'R2'> LongRun {
        doc /* 1 回の充電で 60 分以上動く */
    }

    // 構造
    port def PowerPort;
    item def StartCommand;
    item def LowBattery;
    item def Charged;

    part def Battery {
        attribute capacity = 3000;
        port pwr : PowerPort;
    }
    part def SuctionMotor {
        port pwr : ~PowerPort;
    }
    part def Controller {
        port pwr : ~PowerPort;
    }
    part def Vacuum {
        part battery : Battery;
        part motor : SuctionMotor;
        part controller : Controller;
        connect battery.pwr to motor.pwr;
        connect battery.pwr to controller.pwr;
    }

    satisfy CleanFloor by Vacuum;
    satisfy LongRun by Battery;

    verification def SuctionTest {
        objective { verify CleanFloor; }
    }
    verification def RunTimeTest {
        objective { verify LongRun; }
    }

    // 振る舞い
    action def CleanRoom {
        first start;
        then action leaveDock;
        then action sweep;
        then decide checkBattery;
            if batteryLow then goHome;
            else sweep;
        action goHome;
        first goHome then done;
    }

    state def VacuumStates {
        entry; then idle;
        state idle;
        state cleaning {
            entry action startBrush;
            exit action stopBrush;
        }
        state charging;
        transition first idle accept StartCommand then cleaning;
        transition first cleaning accept LowBattery then charging;
        transition first charging accept Charged then idle;
    }

    part def User;
    part def PhoneApp;
    occurrence def StartFromApp {
        part user : User;
        part app : PhoneApp;
        part vacuum : Vacuum;
        message tapStart of StartCommand from user to app;
        message sendStart of StartCommand from app to vacuum;
    }
}
