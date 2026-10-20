package CoffeeMachine {
    // フェーズ管理：要素やパッケージに @Phase を付けて分類する（パッケージに付けると中の要素が継承）
    metadata def Phase { attribute stage : PhaseKind; }
    enum def PhaseKind { enum StakeholderNeeds; enum SystemRequirements; enum Architecture; enum Verification; }

    requirement def <'U1'> TastyCoffee {
        @Phase { stage = PhaseKind::StakeholderNeeds; }
        doc /* おいしいコーヒーを手早くいれたい */
    }
    requirement def <'S1'> WaterTemperature {
        @Phase { stage = PhaseKind::SystemRequirements; }
        doc /* 抽出中のお湯を 90〜96 ℃に保つ */
    }
    requirement def <'S2'> BrewTime {
        @Phase { stage = PhaseKind::SystemRequirements; }
        doc /* 1 杯を 60 秒以内にいれる */
    }
    #derivation dependency from WaterTemperature to TastyCoffee;
    #derivation dependency from BrewTime to TastyCoffee;

    part def Heater { @Phase { stage = PhaseKind::Architecture; } }
    part def TempSensor { @Phase { stage = PhaseKind::Architecture; } }
    part def TempController {
        @Phase { stage = PhaseKind::Architecture; }
        calc power : HeaterPower;
    }
    part def Machine {
        @Phase { stage = PhaseKind::Architecture; }
        part heater : Heater;
        part sensor : TempSensor;
        part controller : TempController;
        flow from sensor to controller;
        flow from controller to heater;
    }
    satisfy WaterTemperature by Machine;

    constraint def TemperatureRange {
        attribute t : Real;
        t >= 90 and t <= 96
    }
    calc def HeaterPower {
        in attribute error : Real;
        return attribute watts : Real = error * 50;
    }

    verification def TemperatureTest {
        @Phase { stage = PhaseKind::Verification; }
        objective { verify WaterTemperature; }
    }
}
